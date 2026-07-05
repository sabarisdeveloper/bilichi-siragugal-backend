const db = require("../config/db");

// Create Member
const createMember = async (req, res) => {
  try {
    const {
      member_name,
      father_name,
      dob,
      age,
      gender,
      blood_group,
      mobile,
      whatsapp,
      email,
      profession,
      wardNo,
      aadhaar,
      address,
    } = req.body;

    // Uploaded image filename
    const photo = req.file ? `${req.file.filename}` : null;

    const sql = `
      INSERT INTO members
      (
        member_name,
        father_name,
        dob,
        age,
        gender,
        blood_group,
        mobile,
        whatsapp,
        email,
        profession,
        ward_no,
        aadhaar,
        address,
        photo
      )
      VALUES
      (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    await db.query(sql, [
      member_name,
      father_name,
      dob,
      age,
      gender,
      blood_group,
      mobile,
      whatsapp,
      email,
      profession,
      wardNo,
      aadhaar,
      address,
      photo,
    ]);

    return res.status(201).json({
      success: true,
      message: "Member Registered Successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Members
const getMembers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM members ORDER BY id DESC"
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Single Member (Future)
const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM members WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createMember,
  getMembers,
  getMemberById,
};