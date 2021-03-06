import React from "react";
import { List, Segment } from "semantic-ui-react";
import { EditIcon } from "../editIcon";

import style from "../../styles.css";

const CurrentEducation = props => {
  return (
    <Segment>
      <div styleName="style.flex-box">
        <List styleName="style.list">
          <List.Item>
            <List.Content>
              <div>
                Semester {props.item.semester}
                <p styleName="style.gray">
                  SGPA: {props.item.sgpa}
                  <br />
                  CGPA: {props.item.cgpa}
                </p>
              </div>
            </List.Content>
          </List.Item>
        </List>

        <div>
          <EditIcon
            rearrange={props.rearrange}
            onClick={() => props.manageData(props.item.id, props.data, props.componentName)}
          />
        </div>
      </div>
    </Segment>
  );
};
export default CurrentEducation;
