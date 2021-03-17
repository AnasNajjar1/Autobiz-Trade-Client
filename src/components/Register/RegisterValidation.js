import {
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { t } from "../common/Translate";

export const RegisterValidation = ({
  validationBloc,
  loading,
  registerFailed,
}) => {
  return (
    <div className={`validation-bloc ${validationBloc ? "d-block" : "d-none"}`}>
      {!loading && (
        <>
          {!registerFailed ? (
            <Fragment>
              <p>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="m-5"
                  size="5x"
                />
              </p>
              <p>{t("validationMessage1Form")}</p>
              <p>{t("validationMessage2Form")}</p>
              <p>{t("validationMessage3Form")}</p>
            </Fragment>
          ) : (
            <Fragment>
              <p>
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  className="m-5"
                  size="5x"
                />
              </p>
              <p>{t("errorMessageForm")}</p>
            </Fragment>
          )}
          <Link to="/login" className="mt-5">
            {t("homePageCtaForm")}
          </Link>
        </>
      )}
    </div>
  );
};
