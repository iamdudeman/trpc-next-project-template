import styles from "./Modal.module.scss";
import { PureComponent, ReactNode } from "react";
import ClientOnlyPortal from "@components/general/ClientOnlyPortal";

export const MOUNT_ELE_ID = "modal-portal";

interface Props {
  children: ReactNode;
  open?: boolean;
}

interface InertElement extends HTMLElement {
  inert: boolean;
}

export default class Modal extends PureComponent<Props> {
  private openingEle: HTMLElement | null = null;

  public componentDidMount() {
    document.addEventListener("focusout", this.focusOutEvent);

    if (this.props.open) {
      setInert(true);
    }
  }

  public componentWillUnmount() {
    if (this.props.open) {
      this.refocusOpeningEle();
    }

    document.removeEventListener("focusout", this.focusOutEvent);
  }

  public componentDidUpdate(prevProps: Readonly<Props>) {
    if (!prevProps.open && this.props.open) {
      setInert(true);
    } else if (prevProps.open && !this.props.open) {
      this.refocusOpeningEle();
    }
  }

  public render() {
    const { open, children } = this.props;

    return (
      <ClientOnlyPortal selector={`#${MOUNT_ELE_ID}`}>
        <dialog className={styles.modal} open={open}>
          <div className={styles.modalContent}>{children}</div>
        </dialog>
      </ClientOnlyPortal>
    );
  }

  private focusOutEvent = (event) => {
    if (this.props.open && this.openingEle === null) {
      this.openingEle = event.target;
    }
  };

  private refocusOpeningEle = () => {
    setInert(false);
    this.openingEle?.focus();
    this.openingEle = null;
  };
}

function setInert(inert: boolean) {
  const ele = document.getElementById("__next") as InertElement;

  ele.inert = inert;
}
