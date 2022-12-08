import React from 'react';
import { Box, Container, Button } from '@mui/material'

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Schedule from '../../assets/images/IllustrationSchedule.png';
import Share from '../../assets/images/IllustrationShare.png';

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import styles from './Info.module.scss';

const Info = () => {
    return (
        <main>
            <Header />
            <Container maxWidth='lg'>
                <section className={styles.section1}>
                    <div className={styles.text_container}>
                        <h1 className={styles.main_text}>Professional<br/>scheduling made easy</h1>
                        <span className={styles.description}>Weekly is the fastest and easiest way to schedule<br/>anything — from meetings to the next great<br/>collaboration.</span>
                        <Box className={styles.buttons_box}>
                            <Button href='/signup' variant="contained" className={styles.signup_btn}>Try it free <ArrowForwardIcon/></Button>
                        </Box>
                    </div>
                    <img src={Schedule} alt='background illustrtation'className={styles.Illustarion}/>
                </section>

                <section style={{ position: 'relative' }} className={styles.section2}>
                    <div className={styles.text_container}>
                        <h1 className={styles.heading}>Share your Weekly availability<br/>with others</h1>
                        <span className={styles.description}>Simply invite other members to your Weekly<br/>calendar and watch prospects and recruits book<br/>high-value meetings with you.</span>
                    </div>
                    <img src={Share} alt='background illustrtation'className={styles.Illustarion}/>
                </section>
            </Container>
            <Footer/>
        </main>
    );
}

export default Info;