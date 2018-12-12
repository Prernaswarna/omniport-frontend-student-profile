import React from "react";
import {
  Form,
  Input,
  Button,
  Icon,
  Label,
  Segment,
  Transition,
  Message
} from "semantic-ui-react";
import { getCookie } from "formula_one";
import axios from "axios";
import moment from "moment";
import { validateEmail } from "./../helperFunctions";
import style from "../styles.css";
import { ErrorTransition, FormTransition } from "./transition";

export const initial = {
  update: false,
  data: {
    referee: "",
    designation: "",
    institute: "",
    phoneNumber: "",
    email: "",
    priority: 1,
    visibility: true
  }
};
export class RefereeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.formData,
      update: props.update,
      list: null,
      errors: [],
      visible: false
    };
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress, false);
    this.setState({ visible: true });
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress, false);
  }
  handleKeyPress = e => {
    if (e.keyCode === 27) {
      this.handleHide();
    }
    if (e.keyCode === 13) {
      this.handleErrors();
    }
  };
  componentWillUpdate(nextProps, nextState) {
    if (this.props != nextProps && nextProps.update == true) {
      this.setState({
        data: nextProps.formData,
        update: nextProps.update,
        visible: true
      });
    } else if (this.props != nextProps && nextProps.update == false) {
      this.setState(initial);
    }
  }

  handleChange = (event, { name = undefined, value }) => {
    console.log(this.state.data);
    event.persist();
    if (this.state.data.hasOwnProperty(name)) {
      this.setState({ data: { ...this.state.data, [name]: value } });
    }
  };
  handleSubmit = e => {
    let headers = {
      "X-CSRFToken": getCookie("csrftoken")
    };
    axios({
      method: "post",
      url: "/api/student_profile/referee/",
      data: this.state.data,
      headers: headers
    }).then(response => {
      this.props.appendData(response.data);
      this.setState(initial, () => {
        this.handleHide();
      });
    });
  };
  handleUpdateDelete = option => {
    let headers = {
      "X-CSRFToken": getCookie("csrftoken")
    };
    axios({
      method: option,
      url: "/api/student_profile/referee/" + this.state.data.id + "/",
      data: this.state.data,
      headers: headers
    }).then(response => {
      this.props.updateDeleteData(this.state.data, option);
      this.setState(initial, () => {
        this.handleHide();
      });
    });
  };
  handleErrors = () => {
    console.log(this.state.data);
    let errors = [];
    const {
      referee,
      designation,
      institute,
      phoneNumber,
      email
    } = this.state.data;
    if (referee == "") {
      errors.push("Refree name must be filled");
    }
    if (designation == "") {
      errors.push("Designation must be filled");
    }
    if (institute == "") {
      errors.push("Institute name must be filled");
    }
    if (email == "") {
      errors.push("Email must be filled");
    } else if (!validateEmail(email)) {
      errors.push("Please enter a valid email address");
    }
    if (errors.length > 0) {
      this.setState({ errors: errors });
    } else {
      this.setState({ errors: [] }, () => {
        if (this.state.update == false) this.handleSubmit();
        else this.handleUpdateDelete("put");
      });
    }
  };
  handleHide = () => {
    this.setState({ visible: false });
    setTimeout(this.props.handleHide, 200);
  };
  render() {
    const { update } = this.state;
    const {
      referee,
      designation,
      institute,
      phoneNumber,
      email
    } = this.state.data;
    return (
      <div>
        <FormTransition visible={this.state.visible}>
          <Segment basic>
            <Segment attached="top" styleName="style.headingBox">
              <h3 styleName="style.heading">Referee</h3>
              <Icon color="grey" name="delete" onClick={this.handleHide} />
            </Segment>

            <Segment attached styleName="style.formStyle">
              <ErrorTransition errors={this.state.errors} />
              <Form autoComplete="off">
                <Form.Group widths="equal">
                  <Form.Field required>
                    <label>Referee</label>
                    <Form.Input
                      onChange={this.handleChange}
                      value={referee}
                      name="referee"
                      placeholder="Referee"
                    />
                  </Form.Field>
                  page
                  <Form.Field required>
                    <label>Designation</label>
                    <Form.Input
                      onChange={this.handleChange}
                      value={designation}
                      name="designation"
                      placeholder="Designation"
                    />
                  </Form.Field>
                </Form.Group>
                <Form.Field required>
                  <label>Institute</label>
                  <Form.Input
                    onChange={this.handleChange}
                    value={institute}
                    name="institute"
                    placeholder="Institute"
                  />
                </Form.Field>
                <Form.Field>
                  <label>Phone number</label>
                  <Input
                    onChange={this.handleChange}
                    value={phoneNumber}
                    name="phoneNumber"
                    placeholder="Phone number (optional)"
                  />
                </Form.Field>
                <Form.Field required>
                  <label>Email</label>
                  <Form.Input
                    onChange={this.handleChange}
                    value={email}
                    name="email"
                    placeholder="Email"
                  />
                </Form.Field>
              </Form>
            </Segment>
            {update ? (
              <Segment attached="bottom" styleName="style.headingBox">
                <Button onClick={this.handleErrors} color="blue">
                  Save Changes
                </Button>
                <Button
                  color="red"
                  onClick={() => this.handleUpdateDelete("delete")}
                >
                  Delete
                </Button>
              </Segment>
            ) : (
              <Segment attached="bottom" styleName="style.buttonBox">
                <Button onClick={this.handleErrors} color="blue" type="submit">
                  Submit
                </Button>
              </Segment>
            )}
          </Segment>
        </FormTransition>
      </div>
    );
  }
}