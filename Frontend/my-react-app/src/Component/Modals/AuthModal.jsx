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
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const userId = params.get("user_id");
    
    if (accessToken && refreshToken && userId) {
      // Store tokens in localStorage
      localStorage.setItem("userId", userId);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Show success message
      message.success("Successfully signed in!");
      
      // Refresh the page
      window.location.reload();
    }
  }, []);

  const handleSignIn = async (values) => {
    try {
      setIsLoading(true);
      const response = await AuthService.login(values.email, values.password);
      localStorage.setItem("userId", response.userId);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      message.success("Welcome back!");
      onClose();
      signInForm.resetFields();
      window.location.reload();
    } catch (err) {
      message.error("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (values) => {
    try {
      setIsLoading(true);