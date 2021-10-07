import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AddIcon from '@material-ui/icons/Add';
import { withRouter } from 'react-router-dom'
import { RouteMap } from "../../router/WalletRouter";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));


const HomeHeader = props => {

    const addWalletClickHandler = () => {
        props.history.push(RouteMap.WalletAdd);
    }
    const classes = useStyles();
    return (
        <Toolbar>
            {/*<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">*/}
            {/*    <MenuIcon />*/}
            {/*</IconButton>*/}
            <Typography variant="h6" className={classes.title}>
                Minotaur
            </Typography>
            {/*<IconButton aria-label="show 17 new notifications" color="inherit">*/}
            {/*<Badge badgeContent={""} color="secondary">*/}
            {/*    <NotificationsIcon />*/}
            {/*</Badge>*/}
            {/*</IconButton>*/}
            <IconButton aria-label="show 17 new notifications" color="inherit" onClick={addWalletClickHandler}>
                {/*<Badge badgeContent={17} color="secondary">*/}
                <AddIcon/>
                {/*</Badge>*/}
            </IconButton>
        </Toolbar>
    )
}

export default withRouter(HomeHeader);
