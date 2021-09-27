import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ErrorIcon from "@material-ui/icons/Error";
import DeleteIcon from "@material-ui/icons/Delete";
import SettingsIcon from "@material-ui/icons/Settings";
import axios from "axios";
import { useParams } from "react-router-dom";
import Email from "./Email";
import Backdrop from "./Backdrop";

const useStyles = makeStyles({
  list: {
    width: 250,
    marginTop: "30%",
    color: "white",
  },
});

export default function TemporaryDrawer() {
  const [seeMail, setSeeMail] = useState(false);

  let { id } = useParams();
  // delete users
  const handleDelete = async () => {
    //warning flag will be here

    await axios
      .delete(`/delete/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("logged");
        setTimeout(() => {
          window.location.href = "/";
        }, 400);
      })
      .catch((err) => console.log(err.response.data.error));
  };

  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem
          style={{ cursor: "pointer", backgroundColor: "orange" }}
          onClick={() => setSeeMail(!seeMail)}
        >
          <ListItemIcon>
            {" "}
            <ErrorIcon className="text-default" />
          </ListItemIcon>
          Report a problem
        </ListItem>
        <br />
        <ListItem
          onClick={handleDelete}
          style={{ cursor: "pointer", backgroundColor: "red" }}
        >
          <ListItemIcon>
            {" "}
            <DeleteIcon className="text-default" />
          </ListItemIcon>
          Delete my account
        </ListItem>
        <br />
      </List>
    </div>
  );

  return (
    <div className="drawerBtn">
      {seeMail && (
        <>
          <Email
            close={(c) => {
              setSeeMail(c);
            }}
          />
          <Backdrop />
        </>
      )}
      <SettingsIcon
        onClick={toggleDrawer("right", true)}
        style={{ color: "white", marginTop: "5px", cursor: "pointer" }}
      />
      <Drawer
        anchor="right"
        open={state["right"]}
        onClose={toggleDrawer("right", false)}
      >
        {list("right")}
      </Drawer>
    </div>
  );
}
