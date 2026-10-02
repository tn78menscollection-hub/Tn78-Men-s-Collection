/**
 * Comprehensive Indian Pincode Directory & Auto-fill Lookup
 * Supports instant detection of City/District and State from 6-digit postal code.
 */

export interface PincodeInfo {
  city: string;
  state: string;
}

// Prefix / exact mapping for high-density postal regions in India
const EXACT_PINCODES: Record<string, PincodeInfo> = {
  // Tamil Nadu (Headquarters & Key Hubs)
  "641601": { city: "Tirupur", state: "Tamil Nadu" },
  "641602": { city: "Tirupur", state: "Tamil Nadu" },
  "641603": { city: "Tirupur", state: "Tamil Nadu" },
  "641604": { city: "Tirupur", state: "Tamil Nadu" },
  "641001": { city: "Coimbatore", state: "Tamil Nadu" },
  "641002": { city: "Coimbatore", state: "Tamil Nadu" },
  "641018": { city: "Coimbatore", state: "Tamil Nadu" },
  "600001": { city: "Chennai", state: "Tamil Nadu" },
  "600002": { city: "Chennai", state: "Tamil Nadu" },
  "600004": { city: "Chennai (Mylapore)", state: "Tamil Nadu" },
  "600017": { city: "Chennai (T. Nagar)", state: "Tamil Nadu" },
  "600028": { city: "Chennai (R.A. Puram)", state: "Tamil Nadu" },
  "600034": { city: "Chennai (Nungambakkam)", state: "Tamil Nadu" },
  "600040": { city: "Chennai (Anna Nagar)", state: "Tamil Nadu" },
  "600096": { city: "Chennai (OMR)", state: "Tamil Nadu" },
  "625001": { city: "Madurai", state: "Tamil Nadu" },
  "625020": { city: "Madurai", state: "Tamil Nadu" },
  "636001": { city: "Salem", state: "Tamil Nadu" },
  "620001": { city: "Tiruchirappalli", state: "Tamil Nadu" },
  "627001": { city: "Tirunelveli", state: "Tamil Nadu" },
  "638001": { city: "Erode", state: "Tamil Nadu" },
  "632001": { city: "Vellore", state: "Tamil Nadu" },

  // Karnataka
  "560001": { city: "Bengaluru", state: "Karnataka" },
  "560002": { city: "Bengaluru (City Market)", state: "Karnataka" },
  "560025": { city: "Bengaluru (Richmond Town)", state: "Karnataka" },
  "560034": { city: "Bengaluru (Koramangala)", state: "Karnataka" },
  "560038": { city: "Bengaluru (Indiranagar)", state: "Karnataka" },
  "560066": { city: "Bengaluru (Whitefield)", state: "Karnataka" },
  "560100": { city: "Bengaluru (Electronic City)", state: "Karnataka" },
  "570001": { city: "Mysuru", state: "Karnataka" },
  "575001": { city: "Mangaluru", state: "Karnataka" },
  "580001": { city: "Hubballi", state: "Karnataka" },

  // Maharashtra
  "400001": { city: "Mumbai (Fort)", state: "Maharashtra" },
  "400020": { city: "Mumbai (Churchgate)", state: "Maharashtra" },
  "400050": { city: "Mumbai (Bandra West)", state: "Maharashtra" },
  "400053": { city: "Mumbai (Andheri West)", state: "Maharashtra" },
  "400054": { city: "Mumbai (Santacruz)", state: "Maharashtra" },
  "400076": { city: "Mumbai (Powai)", state: "Maharashtra" },
  "411001": { city: "Pune", state: "Maharashtra" },
  "411004": { city: "Pune (Deccan)", state: "Maharashtra" },
  "411014": { city: "Pune (Viman Nagar)", state: "Maharashtra" },
  "440001": { city: "Nagpur", state: "Maharashtra" },
  "431001": { city: "Chhatrapati Sambhajinagar", state: "Maharashtra" },
  "422001": { city: "Nashik", state: "Maharashtra" },

  // Delhi & NCR
  "110001": { city: "New Delhi (Connaught Place)", state: "Delhi" },
  "110003": { city: "New Delhi (Lodhi Road)", state: "Delhi" },
  "110017": { city: "New Delhi (Malviya Nagar)", state: "Delhi" },
  "110020": { city: "New Delhi (Okhla)", state: "Delhi" },
  "110024": { city: "New Delhi (Lajpat Nagar)", state: "Delhi" },
  "110048": { city: "New Delhi (Greater Kailash)", state: "Delhi" },
  "110070": { city: "New Delhi (Vasant Kunj)", state: "Delhi" },
  "122001": { city: "Gurugram", state: "Haryana" },
  "122002": { city: "Gurugram (DLF Phase 1)", state: "Haryana" },
  "121001": { city: "Faridabad", state: "Haryana" },
  "201301": { city: "Noida", state: "Uttar Pradesh" },
  "201001": { city: "Ghaziabad", state: "Uttar Pradesh" },

  // Telangana & Andhra Pradesh
  "500001": { city: "Hyderabad", state: "Telangana" },
  "500033": { city: "Hyderabad (Jubilee Hills)", state: "Telangana" },
  "500034": { city: "Hyderabad (Banjara Hills)", state: "Telangana" },
  "500081": { city: "Hyderabad (HITEC City)", state: "Telangana" },
  "530001": { city: "Visakhapatnam", state: "Andhra Pradesh" },
  "520001": { city: "Vijayawada", state: "Andhra Pradesh" },

  // Kerala
  "682001": { city: "Kochi", state: "Kerala" },
  "682011": { city: "Kochi (Ernakulam)", state: "Kerala" },
  "695001": { city: "Thiruvananthapuram", state: "Kerala" },
  "673001": { city: "Kozhikode", state: "Kerala" },

  // West Bengal
  "700001": { city: "Kolkata (BBD Bagh)", state: "West Bengal" },
  "700016": { city: "Kolkata (Park Street)", state: "West Bengal" },
  "700029": { city: "Kolkata (Gariahat)", state: "West Bengal" },
  "700091": { city: "Kolkata (Salt Lake)", state: "West Bengal" },

  // Gujarat
  "380001": { city: "Ahmedabad", state: "Gujarat" },
  "380015": { city: "Ahmedabad (Satellite)", state: "Gujarat" },
  "395001": { city: "Surat", state: "Gujarat" },
  "390001": { city: "Vadodara", state: "Gujarat" },

  // Rajasthan
  "302001": { city: "Jaipur", state: "Rajasthan" },
  "302015": { city: "Jaipur (C-Scheme)", state: "Rajasthan" },
  "342001": { city: "Jodhpur", state: "Rajasthan" },
  "313001": { city: "Udaipur", state: "Rajasthan" },

  // Uttar Pradesh
  "226001": { city: "Lucknow", state: "Uttar Pradesh" },
  "208001": { city: "Kanpur", state: "Uttar Pradesh" },
  "221001": { city: "Varanasi", state: "Uttar Pradesh" },
  "282001": { city: "Agra", state: "Uttar Pradesh" },

  // Punjab & Chandigarh
  "160001": { city: "Chandigarh", state: "Chandigarh" },
  "141001": { city: "Ludhiana", state: "Punjab" },
  "143001": { city: "Amritsar", state: "Punjab" },

  // Madhya Pradesh
  "452001": { city: "Indore", state: "Madhya Pradesh" },
  "462001": { city: "Bhopal", state: "Madhya Pradesh" },

  // Goa
  "403001": { city: "Panaji", state: "Goa" },
  "403601": { city: "Margao", state: "Goa" },
};

/**
 * Fallback detection based on official Indian Postal Circle 2-digit prefixes
 */
export function lookupPincode(pincode: string): PincodeInfo | null {
  const clean = pincode.trim().replace(/\D/g, "");
  if (clean.length !== 6) return null;

  // 1. Direct hit in common directory
  if (EXACT_PINCODES[clean]) {
    return EXACT_PINCODES[clean];
  }

  // 2. Prefix mapping based on Indian postal regions
  const prefix2 = clean.slice(0, 2);
  const prefix3 = clean.slice(0, 3);

  // Tamil Nadu — granular 3-digit prefix to district mapping
  if (prefix2 === "60" || prefix2 === "61" || prefix2 === "62" || prefix2 === "63" || prefix2 === "64") {
    // 3-digit prefix → district lookups
    const tnDistrictMap: Record<string, string> = {
      // 60x — Chennai & surrounding districts
      "600": "Chennai",
      "601": "Tiruvallur / Kancheepuram",
      "602": "Chengalpattu / Kancheepuram",
      "603": "Chengalpattu",
      "604": "Villupuram",
      "605": "Cuddalore / Puducherry",
      "606": "Tiruvannamalai",
      "607": "Cuddalore",
      "608": "Chidambaram / Cuddalore",
      // 61x — Central TN & Cauvery Delta
      "609": "Nagapattinam / Mayiladuthurai",
      "610": "Thiruvarur",
      "611": "Nagapattinam",
      "612": "Thanjavur / Kumbakonam",
      "613": "Thanjavur",
      "614": "Thanjavur / Pattukkottai",
      "620": "Tiruchirappalli",
      "621": "Tiruchirappalli / Ariyalur / Perambalur",
      // 62x — Southern TN
      "622": "Pudukkottai",
      "623": "Sivaganga / Ramanathapuram",
      "624": "Dindigul",
      "625": "Madurai",
      "626": "Virudhunagar / Theni",
      "627": "Tirunelveli / Tenkasi",
      "628": "Thoothukudi",
      "629": "Kanyakumari / Nagercoil",
      // 63x — Western TN & Kongu belt
      "630": "Sivaganga / Karaikudi",
      "631": "Ranipet / Arakkonam",
      "632": "Vellore",
      "633": "Tirupattur",
      "634": "Dharmapuri",
      "635": "Krishnagiri / Hosur",
      "636": "Salem",
      "637": "Namakkal",
      "638": "Erode",
      "639": "Karur",
      // 64x — Coimbatore & Nilgiris belt
      "641": "Coimbatore / Tirupur",
      "642": "Pollachi / Coimbatore",
      "643": "The Nilgiris (Ooty)",
      "644": "Tirupur",
    };

    const district = tnDistrictMap[prefix3] || "Tamil Nadu";
    return { city: district === "Tamil Nadu" ? "" : district, state: "Tamil Nadu" };
  }

  // Kerala — 3-digit prefix to district mapping
  if (prefix2 === "67" || prefix2 === "68" || prefix2 === "69") {
    const klDistrictMap: Record<string, string> = {
      "670": "Kannur",
      "671": "Kasaragod",
      "673": "Kozhikode",
      "676": "Malappuram",
      "677": "Wayanad",
      "678": "Palakkad",
      "679": "Palakkad / Shoranur",
      "680": "Thrissur",
      "682": "Kochi / Ernakulam",
      "683": "Aluva / Ernakulam",
      "685": "Idukki",
      "686": "Kottayam",
      "688": "Alappuzha",
      "689": "Pathanamthitta",
      "690": "Kayamkulam / Alappuzha",
      "691": "Kollam",
      "695": "Thiruvananthapuram",
    };
    const district = klDistrictMap[prefix3] || "";
    return { city: district, state: "Kerala" };
  }

  // Karnataka — 3-digit prefix to district mapping
  if (prefix2 === "56" || prefix2 === "57" || prefix2 === "58" || prefix2 === "59") {
    const kaDistrictMap: Record<string, string> = {
      "560": "Bengaluru",
      "561": "Chikkaballapur / Kolar",
      "562": "Bengaluru Rural / Ramanagara",
      "570": "Mysuru",
      "571": "Kodagu (Coorg) / Chamarajanagar",
      "572": "Tumakuru",
      "573": "Hassan",
      "574": "Mangaluru / Dakshina Kannada",
      "575": "Mangaluru",
      "576": "Udupi",
      "577": "Shivamogga / Davanagere / Chikkamagaluru",
      "580": "Hubballi / Dharwad",
      "581": "Uttara Kannada / Haveri",
      "582": "Gadag",
      "583": "Ballari / Vijayanagara",
      "584": "Raichur",
      "585": "Kalaburagi / Bidar",
      "586": "Vijayapura",
      "587": "Bagalkote",
      "590": "Belagavi",
      "591": "Belagavi / Gokak",
    };
    const district = kaDistrictMap[prefix3] || "";
    return { city: district, state: "Karnataka" };
  }

  // Telangana
  if (prefix2 === "50") {
    const tsDistrictMap: Record<string, string> = {
      "500": "Hyderabad",
      "501": "Rangareddy / Vikarabad",
      "502": "Sangareddy / Medak",
      "503": "Nizamabad",
      "504": "Adilabad / Mancherial",
      "505": "Karimnagar",
      "506": "Warangal",
      "507": "Khammam",
      "508": "Nalgonda / Suryapet",
      "509": "Mahabubnagar",
    };
    const district = tsDistrictMap[prefix3] || "";
    return { city: district, state: "Telangana" };
  }

  // Andhra Pradesh
  if (prefix2 === "51" || prefix2 === "52" || prefix2 === "53") {
    const apDistrictMap: Record<string, string> = {
      "515": "Anantapur",
      "516": "Kadapa (YSR)",
      "517": "Tirupati / Chittoor",
      "518": "Kurnool",
      "520": "Vijayawada",
      "521": "Krishna / Machilipatnam",
      "522": "Guntur",
      "523": "Prakasam / Ongole",
      "524": "Nellore",
      "530": "Visakhapatnam",
      "531": "Anakapalli / Visakhapatnam",
      "532": "Srikakulam",
      "533": "Kakinada / East Godavari",
      "534": "Eluru / West Godavari",
      "535": "Vizianagaram",
    };
    const district = apDistrictMap[prefix3] || "";
    return { city: district, state: "Andhra Pradesh" };
  }

  // Maharashtra & Goa
  if (prefix2 === "40" || prefix2 === "41" || prefix2 === "42" || prefix2 === "43" || prefix2 === "44") {
    if (clean.startsWith("403")) return { city: "Panaji / Goa", state: "Goa" };
    if (clean.startsWith("400")) return { city: "Mumbai", state: "Maharashtra" };
    if (clean.startsWith("401")) return { city: "Thane / Palghar", state: "Maharashtra" };
    if (clean.startsWith("411")) return { city: "Pune", state: "Maharashtra" };
    if (clean.startsWith("412") || clean.startsWith("413")) return { city: "Solapur / Satara", state: "Maharashtra" };
    if (clean.startsWith("416")) return { city: "Kolhapur", state: "Maharashtra" };
    if (clean.startsWith("421")) return { city: "Kalyan / Dombivli", state: "Maharashtra" };
    if (clean.startsWith("422")) return { city: "Nashik", state: "Maharashtra" };
    if (clean.startsWith("425")) return { city: "Jalgaon", state: "Maharashtra" };
    if (clean.startsWith("431")) return { city: "Chhatrapati Sambhajinagar", state: "Maharashtra" };
    if (clean.startsWith("440")) return { city: "Nagpur", state: "Maharashtra" };
    if (clean.startsWith("444")) return { city: "Amravati", state: "Maharashtra" };
    return { city: "", state: "Maharashtra" };
  }

  // Gujarat
  if (prefix2 === "38" || prefix2 === "39") {
    if (clean.startsWith("380")) return { city: "Ahmedabad", state: "Gujarat" };
    if (clean.startsWith("382")) return { city: "Gandhinagar", state: "Gujarat" };
    if (clean.startsWith("390")) return { city: "Vadodara", state: "Gujarat" };
    if (clean.startsWith("395")) return { city: "Surat", state: "Gujarat" };
    if (clean.startsWith("360")) return { city: "Rajkot", state: "Gujarat" };
    return { city: "", state: "Gujarat" };
  }

  // Rajasthan
  if (prefix2 === "30" || prefix2 === "31" || prefix2 === "32" || prefix2 === "33" || prefix2 === "34") {
    if (clean.startsWith("302")) return { city: "Jaipur", state: "Rajasthan" };
    if (clean.startsWith("342")) return { city: "Jodhpur", state: "Rajasthan" };
    if (clean.startsWith("313")) return { city: "Udaipur", state: "Rajasthan" };
    if (clean.startsWith("324")) return { city: "Kota", state: "Rajasthan" };
    return { city: "", state: "Rajasthan" };
  }

  // Delhi
  if (prefix2 === "11") {
    return { city: "New Delhi", state: "Delhi" };
  }

  // Haryana
  if (prefix2 === "12" || prefix2 === "13") {
    if (clean.startsWith("122")) return { city: "Gurugram", state: "Haryana" };
    if (clean.startsWith("121")) return { city: "Faridabad", state: "Haryana" };
    if (clean.startsWith("132")) return { city: "Karnal / Panipat", state: "Haryana" };
    if (clean.startsWith("133") || clean.startsWith("134")) return { city: "Ambala / Panchkula", state: "Haryana" };
    return { city: "", state: "Haryana" };
  }

  // Punjab & Chandigarh
  if (prefix2 === "14" || prefix2 === "15" || prefix2 === "16") {
    if (clean.startsWith("160")) return { city: "Chandigarh", state: "Chandigarh" };
    if (clean.startsWith("141")) return { city: "Ludhiana", state: "Punjab" };
    if (clean.startsWith("143")) return { city: "Amritsar", state: "Punjab" };
    if (clean.startsWith("144")) return { city: "Jalandhar", state: "Punjab" };
    return { city: "", state: "Punjab" };
  }

  // Uttar Pradesh & Uttarakhand
  if (prefix2 === "20" || prefix2 === "21" || prefix2 === "22" || prefix2 === "23" || prefix2 === "24" || prefix2 === "25" || prefix2 === "26" || prefix2 === "27" || prefix2 === "28") {
    if (clean.startsWith("201")) return { city: "Noida / Ghaziabad", state: "Uttar Pradesh" };
    if (clean.startsWith("226")) return { city: "Lucknow", state: "Uttar Pradesh" };
    if (clean.startsWith("208")) return { city: "Kanpur", state: "Uttar Pradesh" };
    if (clean.startsWith("221")) return { city: "Varanasi", state: "Uttar Pradesh" };
    if (clean.startsWith("282")) return { city: "Agra", state: "Uttar Pradesh" };
    if (clean.startsWith("248")) return { city: "Dehradun", state: "Uttarakhand" };
    return { city: "", state: "Uttar Pradesh" };
  }

  // West Bengal
  if (prefix2 === "70" || prefix2 === "71" || prefix2 === "72" || prefix2 === "73" || prefix2 === "74") {
    if (clean.startsWith("700")) return { city: "Kolkata", state: "West Bengal" };
    if (clean.startsWith("711")) return { city: "Howrah", state: "West Bengal" };
    if (clean.startsWith("734")) return { city: "Siliguri / Darjeeling", state: "West Bengal" };
    return { city: "", state: "West Bengal" };
  }

  // Odisha
  if (prefix2 === "75" || prefix2 === "76" || prefix2 === "77") {
    if (clean.startsWith("751")) return { city: "Bhubaneswar", state: "Odisha" };
    if (clean.startsWith("753")) return { city: "Cuttack", state: "Odisha" };
    return { city: "", state: "Odisha" };
  }

  // Madhya Pradesh & Chhattisgarh
  if (prefix2 === "45" || prefix2 === "46" || prefix2 === "47" || prefix2 === "48") {
    if (clean.startsWith("452")) return { city: "Indore", state: "Madhya Pradesh" };
    if (clean.startsWith("462")) return { city: "Bhopal", state: "Madhya Pradesh" };
    if (clean.startsWith("482")) return { city: "Jabalpur", state: "Madhya Pradesh" };
    if (clean.startsWith("474")) return { city: "Gwalior", state: "Madhya Pradesh" };
    return { city: "", state: "Madhya Pradesh" };
  }
  if (prefix2 === "49") {
    if (clean.startsWith("492")) return { city: "Raipur", state: "Chhattisgarh" };
    return { city: "", state: "Chhattisgarh" };
  }

  // Bihar & Jharkhand
  if (prefix2 === "80" || prefix2 === "81" || prefix2 === "82" || prefix2 === "83" || prefix2 === "84" || prefix2 === "85") {
    if (clean.startsWith("800")) return { city: "Patna", state: "Bihar" };
    if (clean.startsWith("834")) return { city: "Ranchi", state: "Jharkhand" };
    if (clean.startsWith("831")) return { city: "Jamshedpur", state: "Jharkhand" };
    return { city: "", state: "Bihar" };
  }

  return null;
}
