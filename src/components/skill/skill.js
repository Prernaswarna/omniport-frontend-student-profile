import React from "react";
import { Dimmer, Icon, Segment, List } from "semantic-ui-react";
import axios from "axios";
import { getCookie } from "formula_one";
import style from "../../styles.css";
import { SkillForm } from "./skillForm";
import { ComponentTransition } from "../transition";

const initial = {
  computerLanguages: "",
  softwarePackages: "",
  additionalCourses: "",
  minorCourses: "",
  languages: ""
};
export class Skill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: initial,
      person_data: "",
      active: false,
      createNew: true,
      empty: ""
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData = e => {
    let { handle } = this.props;
    let headers = {
      "X-CSRFToken": getCookie("csrftoken")
    };
    let url = "";
    if (this.props.handle != undefined) url = this.props.handle + "/handle/";
    axios
      .get("/api/student_profile/skill/" + url)
      .then(response => {
        if (response.data.length == 0 && handle != undefined) {
          this.setState({ empty: "No data to show", createNew: true });
        } else {
          if (response.data.length != 0) this.setState({ data: response.data[0], createNew: false });
        }
      })
      .catch(function(error) {
        // console.error(error);
      });
  };

  handleShow = e => {
    this.setState({
      active: true
    });
  };
  handleUpdate = (data, flag) => {
    this.setState({ active: false, data: data, createNew: flag });
  };
  handleHide = () => {
    this.setState({ active: false });
  };

  render() {
    const { handleShow } = this;
    let { theme } = this.props;
    if (theme == "zero") theme = null;
    const {data} = this.state;
    const additionalCourses =
      data.additionalCourses != "" ? (
        <Segment>
          <List styleName="style.list">
            <List.Item>
              <List.Content>
                <b>Additional Courses</b>
                <p styleName="style.gray">{data.additionalCourses}</p>
              </List.Content>
            </List.Item>
          </List>
        </Segment>
      ) : null;
    const softwarePackages =
      data.softwarePackages != "" ? (
        <Segment>
          <List styleName="style.list">
            <List.Item>
              <List.Content>
                <b>Software Packages</b>
                <p styleName="style.gray">{data.softwarePackages}</p>
              </List.Content>
            </List.Item>
          </List>
        </Segment>
      ) : null;
    const computerLanguages =
      data.computerLanguages != "" ? (
        <Segment>
          <List styleName="style.list">
            <List.Item>
              <List.Content>
                <b>Computer Languages</b>
                <p styleName="style.gray">{data.computerLanguages}</p>
              </List.Content>
            </List.Item>
          </List>
        </Segment>
      ) : null;
    const minorCourses =
      data.minorCourses != "" ? (
        <Segment>
          <List styleName="style.list">
            <List.Item>
              <List.Content>
                <b>Minor Courses</b>
                <p styleName="style.gray">{data.minorCourses}</p>
              </List.Content>
            </List.Item>
          </List>
        </Segment>
      ) : null;
    const languages =
      data.languages != "" ? (
        <Segment>
          <List styleName="style.list">
            <List.Item>
              <List.Content>
                <b>Spoken Languages</b>
                <p styleName="style.gray">{data.languages}</p>
              </List.Content>
            </List.Item>
          </List>
        </Segment>
      ) : null;
    const editMode = (this.props.handle == undefined);
    const show =  editMode || additionalCourses || computerLanguages || minorCourses || languages ;
    return (
      show ?
      <ComponentTransition>
        <Segment padded color={theme}>
          <div styleName="style.headingBox">
            <h3 styleName="style.heading">
              <Icon name="star" color={theme || "blue"} /> Skills
            </h3>
            {editMode ? <Icon color="grey" name="add" circular onClick={handleShow} /> : null}
            {editMode ? null : (
              <span style={{ color: "grey", textAlign: "right" }}>{this.state.empty}</span>
            ) }
          </div>
          {data != initial ? (
            <Segment.Group>
              {computerLanguages}
              {softwarePackages}
              {additionalCourses}
              {minorCourses}
              {languages}
            </Segment.Group>
          ) : null}
          <Dimmer active={this.state.active} page>
            <SkillForm
              data={data}
              createNew={this.state.createNew}
              handleHide={this.handleHide}
              handleUpdate={this.handleUpdate}
            />
          </Dimmer>
        </Segment>
      </ComponentTransition> : null
    );
  }
}
