import React, { useState } from "react";
import { Modal, Form, Input, Button, Select, Row, Col, Typography } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import SkillShareService from "../../Services/SkillShareService";
import UploadFileService from "../../Services/UploadFileService";
import { UploadOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Title } = Typography;
const uploader = new UploadFileService();

// Theme colors from the first component
// Modern color scheme
const themeColors = {
  primary: "#E63946", // Red as primary
  secondary: "#F87171", // Light red for secondary
  accent: "#FF9F1C", // Orange accent for energy/fitness vibe
  background: "#FFF5F5", // Very light red background
  surface: "#FFEBEB", // Light red surface
  cardBg: "#FFFFFF", // White background
  textPrimary: "#333333", // Dark gray for text
  textSecondary: "#666666", // Medium gray for secondary text
  border: "#FECACA", // Light red border
  hover: "#C81E2B", // Deeper red for hover
  danger: "#991B1B", // Dark red for warnings
  success: "#16A34A", // Green for success (kept for contrast)
  gradient: "linear-gradient(135deg, #E63946 0%, #F87171 100%)", // Red gradient
}

const CreateSkillShareModal = () => {
  const snap = useSnapshot(state);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Call the service to create the Skill Share
      await SkillShareService.createSkillShare({
        ...values,
        userId: snap.currentUser?.uid,
        mediaUrls: mediaFiles.map(file => file.url),
        mediaTypes: mediaFiles.map(file => file.type)
      });
      state.SkillShares = await SkillShareService.getAllSkillShares();
      
      // Reset the form and close the modal on success
      form.resetFields();
      setMediaFiles([]);
      state.createSkillShareOpened = false;
    } catch (error) {
      console.error("Error creating Skill Share:", error);
    } finally {
      setLoading(false);
    }
  };