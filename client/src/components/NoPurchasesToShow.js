import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, CardHeader, Typography } from "@material-ui/core";
import ErrorIcon from "@mui/icons-material/Error";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    minWidth: 300,
    maxWidth: 500,
    padding: theme.spacing(4),
    textAlign: "center",
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(6),
    },
    border: "2px solid red", // add border and borderColor properties
    borderColor: "red",
  },
  header: {
    textAlign: "center",
    paddingBottom: 0,
  },
  icon: {
    fontSize: 64,
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const NoPurchasesToShow = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          title={<Typography variant="h4">Query Yielded No Results</Typography>}
        />
        <CardContent>
          <ErrorIcon style={{ color: "red" }} className={classes.icon} />
          <Typography variant="h6">
            No transactions have been recorded for the specified search
            creteria.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoPurchasesToShow;
