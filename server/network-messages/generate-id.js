let nextId = 0;
const generateId = () => `${nextId++}`; // make it a string, we later may want to replace by base 64 number or so
export default generateId;
