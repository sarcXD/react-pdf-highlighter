import React, { Component } from "react";
import { ReactElement } from "react";

import "../style/Tip.css";

interface State {
  compact: boolean;
  text: string;
  key: number | null;
  img: string | null;
}

interface CustomButton {
  key: number;
  type: string;
  ele: ReactElement;
}

interface Props {
  onConfirm: (comment: {
    text: string;
    key: number | null;
    img: string;
  }) => void;
  onOpen: () => void;
  onUpdate?: () => void;
  customButtons?: CustomButton[];
}

export class Tip extends Component<Props, State> {
  state: State = {
    compact: true,
    text: "",
    key: null,
    img: null,
  };
  customButtons: CustomButton[];

  // for TipContainer
  componentDidUpdate(nextProps: Props, nextState: State) {
    const { onUpdate, customButtons } = this.props;
    this.customButtons = customButtons;

    if (onUpdate && this.state.compact !== nextState.compact) {
      onUpdate();
    }
  }

  uploadImg(event) {
    event.preventDefault();
    var img = event.target.files[0];
    this.setState({ img: URL.createObjectURL(img) });
  }

  render() {
    const { onConfirm, onOpen } = this.props;
    const { compact, text, key, img } = this.state;

    return (
      <div className="Tip">
        {compact ? (
          <div
            className="Tip__compact"
            onClick={() => {
              onOpen();
              this.setState({ compact: false });
            }}
          >
            Add highlight
          </div>
        ) : (
          <form
            className="Tip__card"
            onSubmit={(event) => {
              event.preventDefault();
              onConfirm({ text, key, img });
            }}
          >
            <div>
              <textarea
                placeholder="Your comment"
                autoFocus
                value={text}
                onChange={(event) =>
                  this.setState({ text: event.target.value })
                }
                ref={(node) => {
                  if (node) {
                    node.focus();
                  }
                }}
              />
              <div>
                {this.customButtons.map((btn) => (
                  <label key={btn?.key}>
                    {btn?.type === "radio" ? (
                      <input
                        checked={key === btn?.key}
                        type={btn?.type}
                        name="emoji"
                        value={btn?.key}
                        onChange={(event) => this.setState({ key: btn?.key })}
                      />
                    ) : (
                      <input
                        checked={key === btn?.key}
                        type="file"
                        name="emoji"
                        style={{ display: "none" }}
                        onChange={(event) => this.uploadImg(event)}
                      />
                    )}
                    {btn?.ele}
                  </label>
                ))}
              </div>
              {this.state?.img ? (
                <img
                  src={this.state?.img}
                  style={{ width: "50%" }}
                  alt="locally uploaded"
                />
              ) : null}
            </div>
            <div>
              <input type="submit" value="Save" />
            </div>
          </form>
        )}
      </div>
    );
  }
}

export default Tip;
