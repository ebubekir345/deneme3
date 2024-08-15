// To avoid Do not nest ternary expressions warning
const iff = (condition, then, otherwise) => (condition ? then : otherwise);

export default iff;
