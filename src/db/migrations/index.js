import version1 from "./version1";

export const migrate = async database => {
    await version1(database)
};
