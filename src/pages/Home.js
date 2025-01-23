import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import pastaImage from '../images/pasta-unsplash.jpg';
import saladImage from '../images/salad-unsplash.jpg';
import bgImage1 from '../images/bgimage1.jpg';
import bgImage2 from '../images/bgimage2.jpg';
import bgImage3 from '../images/bgimage3.jpg';
import bgImage4 from '../images/bgimage4.jpg';
import bgImage5 from '../images/bgimage5.jpg';
import bgImage6 from '../images/bgimage6.jpg';
import aboutUsImage from '../images/joel-muniz-qvzjG2pF4bE-unsplash.jpg'; // Import the new image

const LandingPage = () => {
  const [currentBg, setCurrentBg] = useState(0);
  const [fade, setFade] = useState(true); // Controls fade animation
  const backgroundImages = [bgImage1, bgImage2, bgImage3, bgImage4, bgImage5, bgImage6];

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Fade out current image
      setTimeout(() => {
        setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
        setFade(true); // Fade in next image
      }, 1000); // Wait for fade out to complete
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className={styles.homebody}>
      <div className={styles.container}>
        {/* Hero Section */}
        <motion.section
          className={styles.hero}
          style={{ backgroundImage: `linear-gradient(135deg, rgba(189, 151, 230, 0.8), rgba(138, 183, 225, 0.8)), url(${backgroundImages[currentBg]})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className={`${styles.heroContent} ${fade ? styles.fadeIn : styles.fadeOut}`}>
            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              SharePlate
            </motion.h1>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              Connecting surplus food with those in need !
            </motion.p>
            <motion.div
              className={styles.cta}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <Link to="/login" className={styles.primaryBtn}>Log In</Link>
              <Link to="/register" className={styles.secondaryBtn}>Sign Up</Link>
            </motion.div>
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section
          className={styles.howItWorks}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2>How It Works ?</h2>
          <div className={styles.steps}>
            <motion.div
              className={styles.step}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className={styles.stepIcon}>1</div>
              <h3>List Surplus Food</h3>
              <p>Restaurants can easily list their surplus food</p>
            </motion.div>
            <motion.div
              className={styles.step}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className={styles.stepIcon}>2</div>
              <h3>Find & Reserve</h3>
              <p>NGOs and individuals can find and reserve available food</p>
            </motion.div>
            <motion.div
              className={styles.step}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className={styles.stepIcon}>3</div>
              <h3>Pickup & Share</h3>
              <p>Coordinate pickup and share with those in need</p>
            </motion.div>
          </div>
        </motion.section>

        {/* Featured Listings */}
        <motion.section
          className={styles.featured}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2>Featured Listings</h2>
          <div className={styles.listings}>
            <motion.div
              className={styles.listingCard}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img src={pastaImage} alt="Food Listing 1" />
              <h3>Delicious Pasta</h3>
              <p>Available for pickup at 7 PM</p>
            </motion.div>
            <motion.div
              className={styles.listingCard}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <img src={saladImage} alt="Food Listing 2" />
              <h3>Fresh Salad</h3>
              <p>Available for pickup at 6 PM</p>
            </motion.div>
          </div>
        </motion.section>

        {/* About Us Section */}
        <motion.section
          className={styles.aboutUs}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2>About Us</h2>
          <div className={styles.aboutContent}>
            <div className={styles.aboutText}>
              <p>
                SharePlate is a platform dedicated to reducing food waste by connecting restaurants with surplus food to NGOs and individuals in need. Our mission is to create a sustainable and compassionate community where no food goes to waste.
              </p>
              <p>
                Founded in 2025, SharePlate has already helped redistribute thousands of meals to those in need. We believe that every meal counts and that together, we can make a significant impact on reducing food waste and hunger.
              </p>
              <p>
                Our platform is easy to use, secure, and designed to make the process of sharing surplus food as seamless as possible. Join us in our mission to create a world where no one goes hungry and no food is wasted.
              </p>
            </div>
            <div className={styles.aboutImage}>
              <img src={aboutUsImage} alt="About Us" />
            </div>
          </div>
        </motion.section>

        {/* Contact Info Section */}
        <motion.section
          className={styles.contactInfo}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2>Contact Us</h2>
          <p>Email: info@shareplate.com</p>
          <p>Phone: +1 234 567 890</p>
          <p>Address: Pune, India</p>
        </motion.section>
      </div>
    </div>
  );
};

export default LandingPage;