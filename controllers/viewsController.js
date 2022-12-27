exports.getHome = (req, res) => {
  res.status(200).render("calculator", { title: "Calculator" });
};
