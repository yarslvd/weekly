import React from "react";
import { useSelector } from 'react-redux';

import { styled } from '@mui/system';

// IMPORTING MATERIALS
import { Button, IconButton, Menu, MenuItem, Toolbar, InputBase, Avatar,
        List, ListItem, ListItemButton, ListItemText, SwipeableDrawer, Divider,
        ListItemIcon, Typography, Container, AppBar, Box, Link } from "@mui/material";

// IMPORTING ICONS
import MenuIcon from '@mui/icons-material/Menu';
import TopicIcon from '@mui/icons-material/Topic';
import HomeIcon from '@mui/icons-material/Home';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

import '../../index.scss';
import styles from './Header.module.scss';
import { selectIsAuth } from "../../redux/slices/authSlice";
import axios from '../../redux/axios';

const pages = ['Home', 'Account', 'Contacts'];

//CUSTOM ELEMENTS
const StyledAppBar = styled(AppBar)({
    color: '#000',
    display: 'block',
    backgroundColor: 'transparent',
    marginTop: '20px'
});

const StyledContainer = styled(Container)({
    maxWidth: '1552px'
})

const Header = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [state, setState] = React.useState(false);
    const { userInfo } = useSelector((state) => state.auth);
    
    const auth = useSelector(selectIsAuth);

    let yourAvatarUrl;
    {userInfo && (yourAvatarUrl = `http://localhost:8000/api/files/${userInfo.profile_picture}`)}

    const toggleDrawer = (anchor, open) => (event) => {
        if (
          event &&
          event.type === 'keydown' &&
          (event.key === 'Tab' || event.key === 'Shift')
        ) {
          return;
        }
    
        setState({ ...state, [anchor]: open });
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const list = (anchor) => (
        <Box
          sx={{ width: '300px' }}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
            {auth && (
                <List style={{padding: '40px 20px'}}>
                    <ListItem disablePadding>
                        <Avatar alt="Demy Sharp" src={yourAvatarUrl} style={{ marginRight: '10px'}} />
                        <ListItemText primary={userInfo && userInfo.full_name} className='menuName' disableTypography />
                    </ListItem>
                </List>
            )}
        <Divider />
          <List>
            {pages.map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                    <ListItemIcon style={{ justifyContent: 'center'}}>
                        {index === 0 ? <HomeIcon /> : null}
                        {index === 1 ? <QuestionAnswerIcon /> : null}
                        {index === 2 ? <TopicIcon /> : null}
                    </ListItemIcon>
                    <ListItemText primary={text} className='drawerLinks' disableTypography />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          {!auth && (
            <Box sx={{ display: 'flex', ml: '20px', gap: '10px', margin: '20px 30px' }}>
                <Button href="/login" variant="outlined" className='menuLogin'>Log In</Button>
                <Button href='/signup' variant="contained" className='menuSignup'>Sign Up</Button>
            </Box>
          )}
        </Box>
    );

    return (
        <StyledAppBar position="static" elevation={0}>
            <StyledContainer maxWidth='xl'>
                <Toolbar disableGutters className={styles.div_wrapper}>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            display: { xs: 'none', sm: 'flex' },
                            fontFamily: 'Oswald',
                            color: '#3D405B',
                            textDecoration: 'none',
                            fontSize: '40px',
                            minWidth: '123px',
                            fontWeight: '600'
                        }}
                    >
                        weekly.
                    </Typography>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent:'space-between' }}>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: '50px', mr: '20px' }}>
                            <Button sx={styles.nav_links} href='/home'>Home</Button>
                            <Button sx={styles.nav_links} href='/profile'>Account</Button>
                            <Button sx={styles.nav_links} href='#contacts'>Contacts</Button>
                        </Box>
                        {!auth && (
                            <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: '20px', gap: '10px' }}>
                                <Button href='/login' variant="outlined" className='login_btn'>Log In</Button>
                                <Button href='/signup' variant="contained" className='signup_btn'>Sign Up</Button>
                            </Box>
                        )}
                        {auth && (
                            <div>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    color="inherit"
                                    onClick={handleMenu}
                                >
                                    <Avatar alt={userInfo ? userInfo.login : null} src={yourAvatarUrl} />
                                </IconButton>
                            </div>
                        )}
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <React.Fragment>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={toggleDrawer('right', true)}
                                    color="inherit"
                                >
                                    <MenuIcon style={{ color: '#3D405B' }}/>
                                </IconButton>
                                <SwipeableDrawer
                                    anchor='right'
                                    open={state['right']}
                                    onClose={toggleDrawer('right', false)}
                                    onOpen={toggleDrawer('right', true)}
                                >
                                    {list('right')}
                                </SwipeableDrawer>
                            </React.Fragment>
                        </Box>
                    </div>
                </Toolbar>
            </StyledContainer>
        </StyledAppBar>
    )
}

export default Header;