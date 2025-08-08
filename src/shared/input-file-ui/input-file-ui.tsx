import styles from "./input-file-ui.module.scss";

type Props = {
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  multiple?: boolean;
};

export const InputFileUI = ({ onChange, name, multiple }: Props) => {
  return (
    <>
      <input
        type="file"
        name={name}
        onChange={onChange}
        style={{ display: "none" }}
        multiple={multiple}
      />
      <div className={styles.customInput}>{uploadFileIcon}</div>
    </>
  );
};

const uploadFileIcon = (
  <svg
    width="25"
    height="25"
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.4625 17.3633C11.4625 17.8327 11.8431 18.2133 12.3125 18.2133C12.7819 18.2133 13.1625 17.8327 13.1625 17.3633H11.4625ZM12.9135 4.76224C12.5816 4.43029 12.0434 4.43029 11.7115 4.76224L6.30209 10.1716C5.97015 10.5036 5.97015 11.0417 6.30209 11.3737C6.63404 11.7056 7.17223 11.7056 7.50417 11.3737L12.3125 6.56536L17.1208 11.3737C17.4528 11.7056 17.991 11.7056 18.3229 11.3737C18.6549 11.0417 18.6549 10.5036 18.3229 10.1716L12.9135 4.76224ZM13.1625 17.3633V5.36328H11.4625V17.3633H13.1625Z"
      fill="#434644"
    />
    <path
      d="M6.3125 20.3633H18.3125"
      stroke="#434644"
      stroke-width="1.7"
      stroke-linecap="round"
    />
  </svg>
);
