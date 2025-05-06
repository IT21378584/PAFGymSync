import React, { useState } from "react";
import state from "../../Utils/Store";
import { useSnapshot } from "valtio";

// Theme colors (matching the previous component)
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
  const SkillShareBox = () => {
    const snap = useSnapshot(state);
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <div
        className="my_post"
        onClick={() => {
          state.createSkillShareOpened = true;
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: themeColors.gradient,
          padding: "16px 20px",
          borderRadius: "12px",
          boxShadow: isHovered 
            ? "0 8px 24px rgba(90, 155, 255, 0.2)"
            : "0 4px 12px rgba(0, 0, 0, 0.08)",
          marginBottom: "20px",
          color: "white",
          cursor: "pointer",
          transition: "all 0.3s ease",
          transform: isHovered ? "translateY(-3px)" : "translateY(0)",
          border: `1px solid ${isHovered ? "rgba(255, 255, 255, 0.2)" : "transparent"}`,
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Decorative circles matching the MealPlanCard style */}
        <div 
          style={{ 
            position: "absolute", 
            right: -20, 
            top: -20, 
            width: 100, 
            height: 100, 
            borderRadius: "50%", 
            background: "rgba(255,255,255,0.15)",
            zIndex: 1,
            transition: "transform 0.5s ease-in-out",
            transform: isHovered ? "scale(1.2)" : "scale(1)"
          }} 
        />
        
        <div 
          style={{ 
            position: "absolute", 
            left: 10, 
            bottom: -30, 
            width: 60, 
            height: 60, 
            borderRadius: "50%", 
            background: "rgba(255,255,255,0.15)",
            zIndex: 1,
            transition: "transform 0.5s ease-in-out",
            transform: isHovered ? "scale(1.2) translateX(10px)" : "scale(1)"
          }} 
        />
  
        <div
          className="post_top"
          style={{ 
            display: "flex", 
            alignItems: "center", 
            position: "relative", 
            zIndex: 2 
          }}
        >
          <img
            alt={snap.currentUser?.username || "Profile"}
            src={snap.currentUser?.image}
            style={{
              width: "45px",
              height: "45px",
              marginRight: "15px",
              borderRadius: "50%",
              border: "2px solid rgba(255, 255, 255, 0.7)",
              transition: "transform 0.3s ease",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
              boxShadow: isHovered ? "0 2px 10px rgba(0, 0, 0, 0.1)" : "none"
            }}
          />
          <input
            type="text"
            placeholder={`What skill are you sharing today, ${snap.currentUser?.username || "User"}?`}
            style={{
              flexGrow: 1,
              border: "none",
              padding: "12px 16px",
              borderRadius: "8px",
              color: themeColors.textPrimary,
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              fontSize: "14px",
              transition: "all 0.3s ease",
              boxShadow: isHovered ? "0 4px 12px rgba(0, 0, 0, 0.08)" : "0 2px 6px rgba(0, 0, 0, 0.04)",
              outline: "none"
            }}
            readOnly // Making input read-only since the whole component is clickable
            onClick={(e) => e.stopPropagation()} // Preventing input click from propagating
          />
        </div>
      </div>
    );
  };
  
  export default SkillShareBox;