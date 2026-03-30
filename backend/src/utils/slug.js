const createSlug = (name) => {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
};

export default createSlug;
