import React, { useState } from 'react';
import { AiOutlineMail, AiOutlinePhone, AiOutlineEnvironment, AiOutlineGithub } from 'react-icons/ai';
import logo from '../assets/LogoBK.png';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: <AiOutlineMail />,
      title: "Email",
      info: "duynguyendang04@gmail.com",
      link: "mailto:duynguyendang04@gmail.com"
    },
    {
      icon: <AiOutlinePhone />,
      title: "Phone",
      info: "(+84) 38****967",
      link: "tel:+84388969967"
    },
    {
      icon: <AiOutlineEnvironment />,
      title: "Website",
      info: "HCMUT",
      link: "https://hcmut.edu.vn/"
    },
    {
      icon: <AiOutlineGithub />,
      title: "GitHub",
      info: "Developer GitHub Profile",
      link: "https://github.com/l1ttled1no"
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="contact-container">
      <section className="hero-section">
        <img src={logo} alt="Project Logo" className="project-logo" />
        <h1>Contact Us</h1>
        <p className="subtitle">Get in touch with our team</p>
      </section>

      <section className="contact-info-section">
        <h2>Contact Information</h2>
        <div className="contact-grid">
          {contactInfo.map((item, index) => (
            <a 
              href={item.link} 
              key={index} 
              className="contact-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="contact-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.info}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="contact-form-section">
        <h2>Send us a Message</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter subject"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter your message"
              required
              rows="5"
            />
          </div>
          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </section>
    </div>
  );
};

export default Contact; 