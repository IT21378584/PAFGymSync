import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Upload, message, Divider, Tabs, Typography } from "antd";
import { 
  InboxOutlined, 
  UserOutlined, 
  LockOutlined, 
  MailOutlined, 
  GoogleOutlined,
  GithubOutlined,
  ProfileOutlined,
  AimOutlined
} from "@ant-design/icons";
import UploadFileService from "../../Services/UploadFileService";
import AuthService from "../../Services/AuthService";
import UserService from "../../Services/UserService";

const { TabPane } = Tabs;
const { Text } = Typography;
const uploader = new UploadFileService();

// Modal styling
const modalStyle = {
  borderRadius: "12px",
  overflow: "hidden"
};

const tabsStyle = {
  marginBottom: 0,
  paddingTop: "16px"
};

const buttonContainerStyle = {
  display: "flex", 
  justifyContent: "center", 
  gap: "16px", 
  marginTop: "16px"
};

const socialButtonStyle = {
  width: "120px", 
  display: "flex", 
  alignItems: "center", 
  justifyContent: "center"
};

const footerTextStyle = {
  marginTop: "24px", 
  textAlign: "center"
};

const AuthModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("signin");
  const [signInForm] = Form.useForm();
  const [signUpForm] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);