const Group = require("../models/Group");
const User = require("../models/user");

exports.createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const group = await Group.create({
      name,
      members: [req.user._id],
      createdBy: req.user._id,
    });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate("members", "name email")
      .populate("createdBy", "name email");
    res.json(groups);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { email } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ msg: "Group not found" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (group.members.includes(user._id))
      return res.status(400).json({ msg: "User already in group" });

    group.members.push(user._id);
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};