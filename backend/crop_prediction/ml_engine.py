# crop/ml_engine.py
# ─────────────────────────────────────────────────────────────
# Pure ML prediction logic — no Django imports.
# Views call these functions; the model is passed in from AppConfig.
# ─────────────────────────────────────────────────────────────

import numpy as np
import pandas as pd


# Categorical columns that need label-encoding before prediction
CAT_COLS = [
    "District", "Province", "Region_Type",
    "Agro_Zone", "Season", "Soil_Type",
]

# Auto-fill Province / Region_Type / Agro_Zone from District
DISTRICT_MAP = {
    "Taplejung": ("Province 1", "Mountain", "High Hills"),
    "Panchthar": ("Province 1", "Hill", "Mid Hills"),
    "Ilam": ("Province 1", "Hill", "Mid Hills"),
    "Jhapa": ("Province 1", "Terai", "Terai"),
    "Morang": ("Province 1", "Terai", "Terai"),
    "Sunsari": ("Province 1", "Terai", "Terai"),
    "Dhankuta": ("Province 1", "Hill", "Mid Hills"),
    "Terhathum": ("Province 1", "Hill", "Mid Hills"),
    "Sankhuwasabha": ("Province 1", "Mountain", "High Hills"),
    "Bhojpur": ("Province 1", "Hill", "Mid Hills"),
    "Solukhumbu": ("Province 1", "Mountain", "High Mountain"),
    "Okhaldhunga": ("Province 1", "Hill", "Mid Hills"),
    "Khotang": ("Province 1", "Hill", "Mid Hills"),
    "Udayapur": ("Province 1", "Hill", "Inner Terai"),
    "Saptari": ("Province 2", "Terai", "Terai"),
    "Siraha": ("Province 2", "Terai", "Terai"),
    "Dhanusha": ("Province 2", "Terai", "Terai"),
    "Mahottari": ("Province 2", "Terai", "Terai"),
    "Sarlahi": ("Province 2", "Terai", "Terai"),
    "Rautahat": ("Province 2", "Terai", "Terai"),
    "Bara": ("Province 2", "Terai", "Terai"),
    "Parsa": ("Province 2", "Terai", "Terai"),
    "Sindhuli": ("Bagmati", "Hill", "Inner Terai"),
    "Ramechhap": ("Bagmati", "Hill", "Mid Hills"),
    "Dolakha": ("Bagmati", "Hill", "High Hills"),
    "Sindhupalchok": ("Bagmati", "Hill", "Mid Hills"),
    "Kavrepalanchok": ("Bagmati", "Hill", "Mid Hills"),
    "Lalitpur": ("Bagmati", "Hill", "Valley"),
    "Bhaktapur": ("Bagmati", "Hill", "Valley"),
    "Kathmandu": ("Bagmati", "Hill", "Valley"),
    "Nuwakot": ("Bagmati", "Hill", "Mid Hills"),
    "Rasuwa": ("Bagmati", "Mountain", "High Hills"),
    "Dhading": ("Bagmati", "Hill", "Mid Hills"),
    "Makwanpur": ("Bagmati", "Hill", "Inner Terai"),
    "Chitwan": ("Bagmati", "Terai", "Inner Terai"),
    "Gorkha": ("Gandaki", "Hill", "Mid Hills"),
    "Manang": ("Gandaki", "Mountain", "High Mountain"),
    "Mustang": ("Gandaki", "Mountain", "High Mountain"),
    "Myagdi": ("Gandaki", "Hill", "High Hills"),
    "Kaski": ("Gandaki", "Hill", "Mid Hills"),
    "Lamjung": ("Gandaki", "Hill", "Mid Hills"),
    "Tanahu": ("Gandaki", "Hill", "Mid Hills"),
    "Nawalpur": ("Gandaki", "Hill", "Inner Terai"),
    "Syangja": ("Gandaki", "Hill", "Mid Hills"),
    "Parbat": ("Gandaki", "Hill", "Mid Hills"),
    "Baglung": ("Gandaki", "Hill", "Mid Hills"),
    "Gulmi": ("Lumbini", "Hill", "Mid Hills"),
    "Palpa": ("Lumbini", "Hill", "Mid Hills"),
    "Arghakhanchi": ("Lumbini", "Hill", "Mid Hills"),
    "Kapilvastu": ("Lumbini", "Terai", "Terai"),
    "Rupandehi": ("Lumbini", "Terai", "Terai"),
    "Nawalparasi_W": ("Lumbini", "Terai", "Terai"),
    "Dang": ("Lumbini", "Hill", "Inner Terai"),
    "Banke": ("Lumbini", "Terai", "Terai"),
    "Bardiya": ("Lumbini", "Terai", "Terai"),
    "Dolpa": ("Karnali", "Mountain", "High Mountain"),
    "Mugu": ("Karnali", "Mountain", "High Mountain"),
    "Humla": ("Karnali", "Mountain", "High Mountain"),
    "Jumla": ("Karnali", "Mountain", "High Hills"),
    "Kalikot": ("Karnali", "Hill", "High Hills"),
    "Dailekh": ("Karnali", "Hill", "Mid Hills"),
    "Jajarkot": ("Karnali", "Hill", "Mid Hills"),
    "Rukum_E": ("Karnali", "Hill", "Mid Hills"),
    "Salyan": ("Karnali", "Hill", "Mid Hills"),
    "Surkhet": ("Karnali", "Hill", "Inner Terai"),
    "Bajura": ("Sudurpashchim", "Mountain", "High Hills"),
    "Bajhang": ("Sudurpashchim", "Mountain", "High Hills"),
    "Achham": ("Sudurpashchim", "Hill", "Mid Hills"),
    "Doti": ("Sudurpashchim", "Hill", "Mid Hills"),
    "Kailali": ("Sudurpashchim", "Terai", "Terai"),
    "Kanchanpur": ("Sudurpashchim", "Terai", "Terai"),
    "Dadeldhura": ("Sudurpashchim", "Hill", "Mid Hills"),
    "Baitadi": ("Sudurpashchim", "Hill", "Mid Hills"),
    "Darchula": ("Sudurpashchim", "Mountain", "High Hills"),
}


def get_district_meta(district: str) -> dict:
    """Return Province, Region_Type, Agro_Zone for a given district."""
    if district not in DISTRICT_MAP:
        raise ValueError(f"Unknown district: '{district}'")
    province, region_type, agro_zone = DISTRICT_MAP[district]
    return {"Province": province, "Region_Type": region_type, "Agro_Zone": agro_zone}


def predict_top3(data: dict, model, encoders, feature_names: list) -> list[dict]:
    """
    Run prediction and return top-3 crops with confidence scores.

    Parameters
    ----------
    data          : flat dict with all 14 input fields
    model         : loaded sklearn model  (from CropConfig.model)
    encoders      : dict of LabelEncoders (from CropConfig.encoders)
    feature_names : list of feature column names in correct order

    Returns
    -------
    List of dicts: [{"rank":1,"crop":"Rice","confidence_pct":91.3}, ...]
    """
    df = pd.DataFrame([data])

    # Encode categorical columns
    for col in CAT_COLS:
        df[col] = encoders[col].transform(df[col])

    # Ensure correct column order expected by the model
    df = df[feature_names]

    # Predict probabilities
    proba   = model.predict_proba(df)[0]
    top3_i  = np.argsort(proba)[::-1][:3]
    top3    = encoders["target"].inverse_transform(top3_i)

    return [
        {
            "rank":           int(i + 1),
            "crop":           str(crop),
            "confidence_pct": round(float(proba[idx]) * 100, 2),
        }
        for i, (crop, idx) in enumerate(zip(top3, top3_i))
    ]


def all_districts() -> list[str]:
    return sorted(DISTRICT_MAP.keys())


SEASON_CHOICES = [
    "Kharif (Summer)",
    "Rabi (Winter)",
    "Zaid (Spring)",
]

SOIL_TYPE_CHOICES = [
    "Alluvial Sandy Loam", "Alluvial Clay Loam", "Alluvial Loam",
    "Sandy Loam", "Clay", "Clay Loam", "Gravelly Loam",
    "Red Sandy Loam", "Red Clay Loam", "Brown Loam", "Sandy Clay",
    "Brown Forest Soil", "Alpine Meadow Soil", "Rocky Soil", "Stony Soil",
]
