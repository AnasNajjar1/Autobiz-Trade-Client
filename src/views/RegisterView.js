import React, {Fragment, useEffect, useState} from "react";
import {Row, Col} from "reactstrap";
import RegisterForm from "../components/Register/RegisterForm";
import {t} from "../components/common/Translate";
import Cookies from "js-cookie";
import {faCheckCircle, faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";

const RegisterView = (props) => {
    const [loading, setLoading] = useState(false);
    const [validationBloc, setValidationBloc] = useState(false);
    const [registerFailed, setRegisterFailed] = useState(false);

    useEffect(() => {
        handleChangeLang(props.match.params.language)
    }, [])

    const handleChangeLang = (language) => {
        Cookies.set("appLanguage", language, {expires: 365});

        window.dispatchEvent(
            new CustomEvent("changeLanguage", {detail: {language}})
        );
    };


    return (
        <div className="page page-register">
            <div className={`register-container ${validationBloc ? 'd-none' : 'd-block'}`}>
                <Row>
                    <Col md={5} className="bloc-left">
                        <div>
                            <h1>{t("titleForm")}</h1>
                            <h2>{t("paragraph1From")}</h2>
                            <p>{t("paragraph2From")}</p>
                        </div>
                    </Col>
                    <Col md={7} className="bloc-right">
                        <RegisterForm {...props}
                                      validationBloc={validationBloc}
                                      setValidationBloc={setValidationBloc}
                                      registerFailed={registerFailed}
                                      setRegisterFailed={setRegisterFailed}
                                      loading={loading}
                                      setLoading={setLoading}
                        />
                    </Col>
                </Row>
            </div>
            {!loading &&
            <div className={`validation-bloc ${validationBloc ? 'd-block' : 'd-none'}`}>
                {!registerFailed ?
                    <Fragment>
                        <p><FontAwesomeIcon icon={faCheckCircle} className="m-5" size='5x'/></p>
                        <p>{t('validationMessage1Form')}</p>
                        <p>{t('validationMessage2Form')}</p>
                        <p>{t('validationMessage3Form')}</p>
                    </Fragment> :
                    <Fragment>
                        <p><FontAwesomeIcon icon={faExclamationCircle} className="m-5" size='5x'/></p>
                        <p>{t('errorMessageForm')}</p>
                    </Fragment>
                }
                <p className="mt-5"><Link to='/login'>{t("homePageCtaForm")}</Link></p>
            </div>
            }
        </div>
    );
};

export default RegisterView;
