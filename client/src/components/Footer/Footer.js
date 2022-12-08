import React from 'react';

import { Typography, Container, Link } from '@mui/material';

import styles from './Footer.module.scss';

import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import TwitterIcon from '@mui/icons-material/Twitter';

const Footer = () => {
    return (
        <footer>
            <Container maxWidth='xl'>
                <div className={styles.upContainer}>
                    <div className={styles.leftFooter}>
                        <Typography
                            variant="h5"
                            noWrap
                            sx={{
                                fontFamily: 'Oswald',
                                color: '#F1FAEE',
                                textDecoration: 'none',
                                fontSize: '24px',
                                minWidth: '123px'
                            }}
                        >
                            weekly.
                        </Typography>
                        <span className={styles.description}>
                            Weekly is the fastest and easiest way to schedule anything — from meetings to the next great collaboration.
                        </span>
                        <div className={styles.iconWrapper}>
                            <Link href='https://www.instagram.com/yarslvd' target='_blank'><InstagramIcon className={styles.icons}/></Link>
                            <Link href='https://www.facebook.com/yarslvd' target='_blank'><FacebookOutlinedIcon className={styles.icons}/></Link>
                            <Link href='https://twitter.com/yarslvd' target='_blank'><TwitterIcon className={styles.icons}/></Link>
                        </div>
                    </div>
                    <div className={styles.rightFooter}>
                        <div className={styles.info}>
                            <h3>Contacts</h3>
                            <div>
                                <a href='tel:+023848383773'>tel: 023848383773</a>
                                <a href='mailto:info@clarify.com'>mail: info@weekly.com</a>
                                <span>addres: Residenzpl. 2, 97070<br/>Würzburg, Germany</span>
                            </div>
                        </div>
                        <div className={styles.links}>
                            <Link href='/home'>Home</Link>
                            <Link href='/profile'>Account</Link>
                            <Link href='#'>Terms Policy</Link>
                            <Link href='#'>Contacts</Link>
                        </div>
                    </div>
                </div>
                <div className={styles.downContainer}>
                    <small>© 2022 Weekly. All rigths reserved</small>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;