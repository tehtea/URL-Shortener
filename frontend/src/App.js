import React, {useReducer} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Paper, TextField, Grid, Typography} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import {tradeLongUrl} from "./services";

const initialState = {
  loading: false,
  urlToShorten: "",
  shortUrl: "",
  errorMessage: "",
};

const ACTION_TYPES = {
  SUBMIT_SUCCESS: "submitSuccess",
  SUBMIT_FAILURE: "submitFaiure",
  SUBMITTING: "submit",
  INPUT_CHANGE: "inputChange",
};

const formReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.INPUT_CHANGE:
      return {...initialState, urlToShorten: action.payload};
    case ACTION_TYPES.SUBMIT_SUCCESS:
      return {...initialState, shortUrl: action.payload};
    case ACTION_TYPES.SUBMIT_FAILURE:
      return {...initialState, errorMessage: action.payload};
    case ACTION_TYPES.SUBMITTING:
      return {...initialState, loading: true};
    default:
      throw new Error();
  }
};

const useStyles = makeStyles({
  root: {
    width: "90vw",
    margin: "0 auto",
    padding: 15,
  },
});

const App = () => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(formReducer, initialState);
  const handleSubmit = async () => {
    try {
      dispatch({
        type: ACTION_TYPES.SUBMITTING,
      });
      const shortUrl = await tradeLongUrl(state.urlToShorten);
      dispatch({
        type: ACTION_TYPES.SUBMIT_SUCCESS,
        payload: shortUrl,
      });
    } catch (error) {
      console.error("See error: ", error);
      const errorMessage = error?.response?.message ?
        error?.response?.message :
        "Unexpected error occurred while shortening URL";
      dispatch({
        type: ACTION_TYPES.SUBMIT_FAILURE,
        payload: errorMessage,
      });
    }
  };
  return (
    <Paper className={classes.root}>
      <Grid container >
        <Typography>
          URL Shortener
        </Typography>
      </Grid>
      {state.shortUrl &&
      <Alert severity="success">
        {"URL shortened, it is now accessible at "}
        <a href={state.shortUrl}>{state.shortUrl}</a>
      </Alert>}
      {state.errorMessage &&
      <Alert severity="error">
        { state.errorMessage }
      </Alert>}
      <Grid container direction='row'>
        <Grid item>
          <TextField
            disabled={state.loading}
            value={state.urlToShorten}
            onInput={(e) =>
              dispatch({
                type: ACTION_TYPES.INPUT_CHANGE,
                payload: e.target.value,
              })}
            label="URL to Shorten"
          />
        </Grid>
        <Grid item>
          <Button
            disabled={state.loading}
            type="submit"
            className={classes.button}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default App;
