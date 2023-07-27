import React, { useState, useEffect } from "react";
import { AppBar, Avatar, Toolbar, Typography, Button } from "@material-ui/core";
import { Link, useNavigate, useLocation} from 'react-router-dom';
import { useDispatch } from "react-redux";
import decode from "jwt-decode";
import useStyles from './styles';
import gratitude from '../../images/Gratitude_final.png';
import BuildMin from "react-file-base64";
import Post from "../Posts/Post/Post";
import { myPosts } from "../../actions/posts";

const Navbar = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    // console.log(user);

    useEffect(() => {
        const token = user?.token;

        if (token) {
            const decodedToken = decode(token);
            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
        }

        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    const logout = () => {
        dispatch({type: 'LOGOUT'});
        navigate("/");
        window.location.reload();
        setUser(null);
    };

    const handleClick = () => {
        // dispatch myPosts from here
        const isCustomAuth = user.token.length < 500;
        if (isCustomAuth) {
            dispatch(myPosts(user.result._id));
            navigate(`/myPosts/${user.result._id}`);
        } else {
            dispatch(myPosts(user.result.sub));
            navigate(`/myPosts/${user.result.sub}`);
        }
    }

    return (
        <AppBar className={classes.appBar} position="static" color="inherit">
            <div component={Link} to="/" className={classes.brandContainer}>
                <Link to="/">
                <img className={classes.image} src={gratitude} alt="memories" height={60}/>
                </Link>

            </div>
            <Toolbar className={classes.toolbar}>
                {user ?(
                    <div className={classes.profile}>
                        <Avatar onClick={handleClick} className={classes.purple} alt={user.result.name} src={user.result.picture}>{user.result.name.charAt(0)}</Avatar>
                        <Typography onClick={handleClick} className={classes.userName} variant="h6" >{user.result.name}</Typography>
                        <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Logout</Button>
                    </div>
                ) : (
                    <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
                )}
            </Toolbar>
        </AppBar>
    );
}; 

export default Navbar;


