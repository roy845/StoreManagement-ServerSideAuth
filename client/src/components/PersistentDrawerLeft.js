import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import SellIcon from "@mui/icons-material/Sell";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useAuth } from "../contex/auth";
import { useDispatch } from "react-redux";
import { resetTotalPurchases } from "../features/products/productsSlice";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(
    localStorage.getItem("drawerOpen") === "true" || false
  );
  const { auth, setAuth } = useAuth();
  const [selectedItem, setSelectedItem] = React.useState(
    +localStorage.getItem("selectedItem") || 0
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDrawerOpen = () => {
    setOpen(true);
    localStorage.setItem("drawerOpen", "true");
  };

  const handleDrawerClose = () => {
    setOpen(false);
    localStorage.setItem("drawerOpen", "false");
  };

  const menuItems = [
    {
      name: "Products",
      icon: <ShoppingCartIcon />,
      onClick: (index) => {
        navigate("/");
        setSelectedItem(index);
        localStorage.setItem("selectedItem", index);
      },
    },
    {
      name: "Customers",
      icon: <PersonIcon />,
      onClick: (index) => {
        navigate("/customers");
        setSelectedItem(index);
        localStorage.setItem("selectedItem", index);
      },
    },
    {
      name: "Purchases",
      icon: <SellIcon />,
      onClick: (index) => {
        navigate("/purchases");
        setSelectedItem(index);
        localStorage.setItem("selectedItem", index);
      },
    },
    {
      name: "Logout",
      icon: <LogoutIcon />,
      onClick: (index) => {
        setAuth(null);
        localStorage.removeItem("auth");
        navigate("/");
        toast.success("Logout Successfully");
        setSelectedItem(index);
        document.title = "Store Management App";
        dispatch(resetTotalPurchases());
      },
    },
  ];

  const header = "Store Management";

  React.useEffect(() => {
    setSelectedItem(+localStorage.getItem("selectedItem"));
    localStorage.removeItem("selectedItem");
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {header}
          </Typography>
          <Typography
            variant="h6"
            noWrap
            component="div"
            style={{
              textAlign: "right",
              marginLeft: "auto",
            }}
          >
            {`Hello, ${auth?.user?.username}`}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              disablePadding
              style={{
                backgroundColor: selectedItem === index ? "#2074d4" : "",
                color: selectedItem === index ? "white" : "",
              }}
            >
              <ListItemButton onClick={() => item.onClick(index)}>
                <ListItemIcon
                  style={{
                    color: selectedItem === index ? "white" : "",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
    </Box>
  );
}
