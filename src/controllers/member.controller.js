const db = require("../config/db");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "membersPhoto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};
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
      ward_no,
      aadhaar,
      address,
    } = req.body;

    if (!aadhaar) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar number is required.",
      });
    }

    if (!/^\d{12}$/.test(aadhaar)) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar number must be exactly 12 digits.",
      });
    }

    const [existingMember] = await db.query(
      "SELECT id FROM members WHERE aadhaar = ?",
      [aadhaar],
    );

    if (existingMember.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Aadhaar number is already registered.",
      });
    }
    // Uploaded image filename
    let photo = null;

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer);

      photo = uploadedImage.secure_url;
    }

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
      ward_no,
      aadhaar,
      address,
      photo,
    ]);

    return res.status(201).json({
      success: true,
      message: "Member Registered Successfully",
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Aadhaar number is already registered.",
      });
    }

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get Members
const getMembers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM members ORDER BY id DESC");

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

    const [rows] = await db.query("SELECT * FROM members WHERE id = ?", [id]);

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
