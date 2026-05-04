"""
Nepal Crop Prediction - Complete ML Pipeline
============================================
Trains multiple ML models, compares them, and saves the best one.
User inputs: District, Season, Soil Type, and environmental parameters.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import warnings
warnings.filterwarnings("ignore")

# ─────────────────────────────────────────────
# 1. LOAD & PREPARE DATA
# ─────────────────────────────────────────────
print("=" * 60)
print("  NEPAL CROP PREDICTION - ML PIPELINE")
print("=" * 60)

df = pd.read_csv("nepal_crop_prediction_dataset.csv")
print(f"\n✅ Dataset loaded: {df.shape[0]:,} rows × {df.shape[1]} columns")
print(f"   Crops to predict: {df['Recommended_Crop'].nunique()} unique crops")
print(f"   Districts covered: {df['District'].nunique()}")

# Select features for model training
FEATURES = [
    "District", "Province", "Region_Type", "Agro_Zone",
    "Season", "Soil_Type", "Altitude_m", "Avg_Temperature_C",
    "Annual_Rainfall_mm", "Humidity_pct", "Soil_pH",
    "Nitrogen_kg_ha", "Phosphorus_kg_ha", "Potassium_kg_ha"
]
TARGET = "Recommended_Crop"

X = df[FEATURES].copy()
y = df[TARGET].copy()

# ─────────────────────────────────────────────
# 2. ENCODE CATEGORICAL FEATURES
# ─────────────────────────────────────────────
categorical_cols = ["District", "Province", "Region_Type", "Agro_Zone", "Season", "Soil_Type"]
encoders = {}

for col in categorical_cols:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    encoders[col] = le

# Encode target
target_encoder = LabelEncoder()
y_encoded = target_encoder.fit_transform(y)
encoders["target"] = target_encoder

print(f"\n✅ Features encoded: {len(categorical_cols)} categorical columns processed")

# ─────────────────────────────────────────────
# 3. TRAIN/TEST SPLIT
# ─────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)
print(f"\n✅ Data split: {len(X_train):,} train / {len(X_test):,} test samples")

# ─────────────────────────────────────────────
# 4. TRAIN & COMPARE MODELS
# ─────────────────────────────────────────────
print("\n" + "─" * 60)
print("  MODEL COMPARISON")
print("─" * 60)

models = {
    "Random Forest":         RandomForestClassifier(n_estimators=150, max_depth=20, random_state=42, n_jobs=-1),
    "Gradient Boosting":     GradientBoostingClassifier(n_estimators=100, max_depth=6, random_state=42),
    "Decision Tree":         DecisionTreeClassifier(max_depth=20, random_state=42),
    "K-Nearest Neighbors":   KNeighborsClassifier(n_neighbors=7),
}

results = {}
for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    cv_scores = cross_val_score(model, X, y_encoded, cv=5, scoring="accuracy", n_jobs=-1)
    results[name] = {
        "model": model,
        "test_accuracy": acc,
        "cv_mean": cv_scores.mean(),
        "cv_std": cv_scores.std()
    }
    print(f"\n  {name}")
    print(f"    Test Accuracy :  {acc*100:.2f}%")
    print(f"    CV Score      :  {cv_scores.mean()*100:.2f}% ± {cv_scores.std()*100:.2f}%")

# ─────────────────────────────────────────────
# 5. SELECT BEST MODEL
# ─────────────────────────────────────────────
best_name = max(results, key=lambda k: results[k]["cv_mean"])
best_model = results[best_name]["model"]
best_acc = results[best_name]["test_accuracy"]

print("\n" + "─" * 60)
print(f"  🏆 BEST MODEL: {best_name}")
print(f"     Test Accuracy: {best_acc*100:.2f}%")
print("─" * 60)

# Feature importance (if supported)
if hasattr(best_model, "feature_importances_"):
    importances = pd.Series(best_model.feature_importances_, index=FEATURES)
    top5 = importances.nlargest(5)
    print("\n  Top 5 Most Important Features:")
    for feat, imp in top5.items():
        bar = "█" * int(imp * 40)
        print(f"    {feat:<25} {bar} {imp:.3f}")

# ─────────────────────────────────────────────
# 6. SAVE MODEL & ENCODERS
# ─────────────────────────────────────────────
joblib.dump(best_model, "crop_model.pkl")
joblib.dump(encoders, "encoders.pkl")
joblib.dump(FEATURES, "feature_names.pkl")
print("\n✅ Model saved as: crop_model.pkl")
print("✅ Encoders saved as: encoders.pkl")

# ─────────────────────────────────────────────
# 7. PREDICTION FUNCTION (for deployment)
# ─────────────────────────────────────────────
def predict_crop(district, province, region_type, agro_zone, season, soil_type,
                 altitude, temperature, rainfall, humidity, ph, nitrogen, phosphorus, potassium):
    """
    Predict the best crop given location and soil parameters.

    Parameters
    ----------
    district       : str  — e.g. "Jhapa"
    province       : str  — e.g. "Province 1"
    region_type    : str  — "Terai" | "Hill" | "Mountain"
    agro_zone      : str  — "Terai" | "Inner Terai" | "Mid Hills" | "High Hills" | "High Mountain" | "Valley"
    season         : str  — "Kharif (Summer)" | "Rabi (Winter)" | "Zaid (Spring)"
    soil_type      : str  — e.g. "Alluvial Clay Loam"
    altitude       : float — meters above sea level
    temperature    : float — average temperature in °C
    rainfall       : float — annual rainfall in mm
    humidity       : float — relative humidity in %
    ph             : float — soil pH (4.0 – 9.0)
    nitrogen       : float — nitrogen content in kg/ha
    phosphorus     : float — phosphorus content in kg/ha
    potassium      : float — potassium content in kg/ha

    Returns
    -------
    str — predicted best crop name
    """
    model = joblib.load("crop_model.pkl")
    enc   = joblib.load("encoders.pkl")

    row = {
        "District": district, "Province": province,
        "Region_Type": region_type, "Agro_Zone": agro_zone,
        "Season": season, "Soil_Type": soil_type,
        "Altitude_m": altitude, "Avg_Temperature_C": temperature,
        "Annual_Rainfall_mm": rainfall, "Humidity_pct": humidity,
        "Soil_pH": ph, "Nitrogen_kg_ha": nitrogen,
        "Phosphorus_kg_ha": phosphorus, "Potassium_kg_ha": potassium,
    }

    df_input = pd.DataFrame([row])
    for col in ["District", "Province", "Region_Type", "Agro_Zone", "Season", "Soil_Type"]:
        df_input[col] = enc[col].transform(df_input[col])

    prediction = model.predict(df_input)
    return enc["target"].inverse_transform(prediction)[0]


def predict_top3(district, province, region_type, agro_zone, season, soil_type,
                 altitude, temperature, rainfall, humidity, ph, nitrogen, phosphorus, potassium):
    """Same as predict_crop but returns top 3 crops with confidence %."""
    model = joblib.load("crop_model.pkl")
    enc   = joblib.load("encoders.pkl")

    row = {
        "District": district, "Province": province,
        "Region_Type": region_type, "Agro_Zone": agro_zone,
        "Season": season, "Soil_Type": soil_type,
        "Altitude_m": altitude, "Avg_Temperature_C": temperature,
        "Annual_Rainfall_mm": rainfall, "Humidity_pct": humidity,
        "Soil_pH": ph, "Nitrogen_kg_ha": nitrogen,
        "Phosphorus_kg_ha": phosphorus, "Potassium_kg_ha": potassium,
    }

    df_input = pd.DataFrame([row])
    for col in ["District", "Province", "Region_Type", "Agro_Zone", "Season", "Soil_Type"]:
        df_input[col] = enc[col].transform(df_input[col])

    proba = model.predict_proba(df_input)[0]
    top3_idx = np.argsort(proba)[::-1][:3]
    top3_crops = enc["target"].inverse_transform(top3_idx)
    top3_conf  = proba[top3_idx] * 100
    return list(zip(top3_crops, top3_conf))


# ─────────────────────────────────────────────
# 8. SAMPLE PREDICTION DEMO
# ─────────────────────────────────────────────
print("\n" + "─" * 60)
print("  SAMPLE PREDICTION DEMO")
print("─" * 60)

test_cases = [
    ("Jhapa",    "Province 1",    "Terai",    "Terai",      "Kharif (Summer)", "Alluvial Clay Loam", 100,  28.5, 1800, 80, 6.8, 280, 55, 200),
    ("Kaski",    "Gandaki",       "Hill",     "Mid Hills",  "Rabi (Winter)",   "Brown Loam",         850,  15.2, 1500, 65, 6.2, 200, 45, 150),
    ("Solukhumbu","Province 1",   "Mountain", "High Mountain","Kharif (Summer)","Alpine Meadow Soil",4000,  8.0,  600, 50, 6.0, 140, 30, 100),
    ("Chitwan",  "Bagmati",       "Terai",    "Inner Terai","Zaid (Spring)",   "Alluvial Loam",      250,  30.0, 1400, 75, 7.0, 250, 60, 220),
]

for case in test_cases:
    d, prov, rt, zone, seas, soil, alt, temp, rain, hum, ph, n, p, k = case
    top3 = predict_top3(d, prov, rt, zone, seas, soil, alt, temp, rain, hum, ph, n, p, k)
    print(f"\n  Location : {d} ({zone}) | Season: {seas}")
    print(f"  Soil     : {soil} | Alt: {alt}m | Temp: {temp}°C | Rain: {rain}mm")
    print(f"  Results  :")
    for i, (crop, conf) in enumerate(top3, 1):
        medal = ["🥇","🥈","🥉"][i-1]
        print(f"    {medal} {crop:<20} ({conf:.1f}% confidence)")

print("\n" + "=" * 60)
print("  ✅ PIPELINE COMPLETE")
print("=" * 60)
