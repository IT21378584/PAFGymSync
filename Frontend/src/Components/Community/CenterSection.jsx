import React, { useEffect, useState } from "react";
import "../../Styles/center_section.css";
import { motion, AnimatePresence } from "framer-motion";
import StoryBox from "./StoryBox";
import MyPost from "./MyPostBox";
import FriendsPost from "./FriendsPost";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import PostService from "../../Services/PostService";
import MealPlanBox from "./MealPlanBox";
import MealPlanCard from "./MealPlanCard";
import CreaetSkillShareBox from "./SkillShareBox";
import SkillShareCard from "./SkillShareCard";
import FriendsSection from "./FriendsSection";
import NotificationsDropdown from "./NotificationsDropdown";
import { Tabs, Avatar, Row, Col, Spin, Badge } from "antd";

const CenterSection = () => {
  const snap = useSnapshot(state);
  const [activeKey, setActiveKey] = useState("1");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Handle scroll to hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setNavbarVisible(false);
      } else {
        setNavbarVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Fetch posts with loading state
  useEffect(() => {
    setLoading(true);
    PostService.getPosts()
      .then((result) => {
        state.posts = result;
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setLoading(false);
      });
  }, []);

  // Function to refresh posts
  const refreshPosts = () => {
    setRefreshing(true);
    PostService.getPosts()
      .then((result) => {
        state.posts = result;
        setRefreshing(false);
      })
      .catch((err) => {
        console.error("Error refreshing posts:", err);
        setRefreshing(false);
      });
  };

  const tabItems = [
    {
      key: "1",
      label: (
        <span className="tab-label">
          <i className="fas fa-comments"></i> Comment & Feedback
        </span>
      ),
      content: (
        <>
          <MyPost />
          {refreshing ? (
            <div className="refresh-indicator">
              <Spin size="large" tip="Refreshing..." />
            </div>
          ) : loading ? (
            <div className="loading-container">
              <Spin size="large" tip="Loading posts..." />
            </div>
          ) : (
            <motion.div
              className="pull-to-refresh"
              drag="y"
              dragConstraints={{ top: 0, bottom: 100 }}
              dragElastic={0.6}
              onDragEnd={(_, info) => {
                if (info.offset.y > 80) {
                  refreshPosts();
                }
              }}
            >
              {!refreshing && (
                <div className="pull-indicator">
                  Pull down to refresh
                </div>
              )}
              <div className="posts-container">
                {snap.posts.map((post, index) => (
                  <motion.div
                    key={post?.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <FriendsPost post={post} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </>
      ),
    },
    {
      key: "2",
      label: (
        <span className="tab-label">
          <i className="fas fa-dumbbell"></i> Meal & Workout Plans
        </span>
      ),
      content: (
        <>
          <MealPlanBox />
          <div className="meal-plans-container">
            {snap.MealPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)" 
                }}
                whileTap={{ scale: 0.98 }}
              >
                <MealPlanCard plan={plan} />
              </motion.div>
            ))}
          </div>
        </>
      ),
    },
    {
      key: "3",
      label: (
        <span className="tab-label">
          <i className="fas fa-lightbulb"></i> SkillShare
        </span>
      ),
      content: (
        <>
          <CreaetSkillShareBox />
          <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
            {snap.SkillShares.map((plan, index) => (
              <Col xs={24} sm={12} md={8} key={plan.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.04, 
                    rotate: 1,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SkillShareCard plan={plan} />
                </motion.div>
              </Col>
            ))}
          </Row>
        </>
      ),
    },
    {
      key: "4",
      label: (
        <span className="tab-label">
          <i className="fas fa-users"></i> Friends
        </span>
      ),
      content: <FriendsSection />,
    },
  ];

  const handleTabChange = (key) => {
    // Add a subtle page transition when changing tabs
    setActiveKey("");
    setTimeout(() => {
      setActiveKey(key);
    }, 100);
  };

  return (
    <div
      className="center"
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 16px",
      }}
    >
      <motion.nav 
        className="navbar"
        initial={{ y: -100 }}
        animate={{ 
          y: navbarVisible ? 0 : -100,
          opacity: navbarVisible ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "#fff",
          padding: "10px 20px",
          borderRadius: "0 0 12px 12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1.5rem",
            fontWeight: 600,
          }}
        >
          <motion.img 
            style={{ maxHeight: 60 }} 
            src="/assets/GYMSYNC.svg" 
            alt="logo"
            whileHover={{ rotate: 10 }}
            whileTap={{ rotate: -10 }}
          />
          <span className="brand-text">GYMSYNC</span>
        </motion.div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Avatar
              style={{
                cursor: "pointer",
                border: "5px solid rgb(223, 27, 86)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
              onClick={() => {
                state.profileModalOpend = true;
              }}
              size={60}
              src={snap.currentUser?.image}
            />
          </motion.div>
        </div>
      </motion.nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <StoryBox />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          marginBottom: "16px",
        }}
        className="content-container"
      >
        <NotificationsDropdown />
        
        <div className="custom-tabs">
          <div className="tab-headers">
            {tabItems.map((item) => (
              <motion.div
                key={item.key}
                className={`tab-header ${activeKey === item.key ? "active" : ""}`}
                onClick={() => handleTabChange(item.key)}
                whileHover={{ backgroundColor: "#f5f5f5" }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
                {activeKey === item.key && (
                  <motion.div 
                    className="tab-indicator" 
                    layoutId="indicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="tab-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {tabItems.find(item => item.key === activeKey)?.content}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CenterSection;