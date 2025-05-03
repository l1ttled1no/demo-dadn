import React from 'react';
import { AiFillSafetyCertificate, AiOutlineHome, AiFillCamera } from 'react-icons/ai';
import { BsShieldLockFill } from 'react-icons/bs';
import { MdOutlineMonitorHeart } from 'react-icons/md';
import logo from '../assets/LogoBK.png';
import './About.css';

const About = () => {
  const teamMembers = [
    {
      name: "Phạm Lê Hữu Hiệp",
      role: "Team Leader",
      description: "AI/ML Integration & Face Recognition Systems"
    },
    {
      name: "Nguyễn Tiến Hưng",
      role: "Developer",
      description: "IoT Integration & Face Recognition Systems"
    },
    {
      name: "Nguyễn Đăng Duy",
      role: "Developer",
      description: "UI/UX Design & Backend Development"
    },
    {
      name: "Hà Kiến Hoa",
      role: "Developer",
      description: "Frontend & Web Development"
    },
    {
      name: "Nguyễn Bá Vương",
      role: "Developer",
      description: "Frontend & Web Development"
    }
  ];

  const features = [
    {
      icon: <BsShieldLockFill />,
      title: "Advanced Security",
      description: "State-of-the-art face recognition technology for secure access control"
    },
    {
      icon: <MdOutlineMonitorHeart />,
      title: "Real-time Monitoring",
      description: "Continuous monitoring of temperature, humidity, and air quality"
    },
    {
      icon: <AiOutlineHome />,
      title: "Smart Automation",
      description: "Intelligent automation of lighting, ventilation, and security systems"
    },
    {
      icon: <AiFillCamera />,
      title: "Video Surveillance",
      description: "24/7 video monitoring with motion detection alerts"
    }
  ];

  return (
    <div className="about-container">
      <section className="hero-section">
        <img src={logo} alt="Project Logo" className="project-logo" />
        <h1>YoloBit-Powered Smart Home Security</h1>
        <p className="subtitle">Next-Generation Home Automation & Security System</p>
      </section>

      <section className="project-overview">
        <h2>About Our Project</h2>
        <div className="overview-content">
          <p>
            Welcome to the future of home security and automation. Our YoloBit-powered system 
            represents a breakthrough in smart home technology, combining advanced face recognition, 
            environmental monitoring, and intelligent automation into one seamless solution.
          </p>
          <p>
            Using cutting-edge YoloBit technology, our system provides comprehensive security through 
            facial recognition access control, ensuring only authorized individuals can enter. The 
            system continuously monitors various environmental parameters including temperature, 
            humidity, and air quality, providing real-time data and automated responses to maintain 
            optimal living conditions.
          </p>
        </div>
      </section>

      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              <div className="member-avatar">
                <AiFillSafetyCertificate className="avatar-icon" />
              </div>
              <h3>{member.name}</h3>
              <h4>{member.role}</h4>
              <p>{member.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About; 