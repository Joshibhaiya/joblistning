export const testPostController = (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }
    res.status(200).send(`Your name is ${name}`);
};
