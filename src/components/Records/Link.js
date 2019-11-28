import React, {useState} from "react";
import { t } from "../common/Translate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

const getParameterByName = (name, url) => {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const Link = ({ items }) => {
    const [ endPoint, setEndPoint ] = useState(null)
    const [ brand, setBrand ] = useState(null)
    const [ model, setModel ] = useState(null)
    const [ year, setYear ] = useState(null)
    const [ fuel, setFuel ] = useState(null)
    const [ body, setBody ] = useState(null)
    const [ box, setBox ] = useState(null)
    const [ rm, setRm ] = useState(null)
    const [ power, setPower ] = useState(null)
    const [ link, setLink ] = useState(null)

    if(typeof items === 'string') {
        if(endPoint===null) setEndPoint(items.split('?')[0])
        if(brand===null) setBrand(getParameterByName('select_vo_marque', items))
        if(model===null) setModel(getParameterByName('select_vo_modele', items))
        if(year===null) setYear(getParameterByName('select_vo_annee', items))
        if(fuel===null) setFuel(getParameterByName('select_vo_carburant', items))
        if(body===null) setBody(getParameterByName('select_vo_carrosserie', items))
        if(box===null) setBox(getParameterByName('select_vo_boite', items))
        if(rm===null) setRm(getParameterByName('select_vo_4rm', items))
        if(power===null) setPower(getParameterByName('select_vo_puissance', items))
        if(endPoint && brand && model && year && fuel && body && box && rm && power) {
        let l = `${endPoint}?select_vo_marque=${brand}&select_vo_modele=${model}&select_vo_annee=${year}&select_vo_carburant=${fuel}
        &select_vo_carrosserie=${body}&select_vo_boite=${box}&select_vo_4rm=${rm}&select_vo_puissance=${power}`
        if(link === null) setLink(l)
        }
    }

    return (<>
        {<a href={link} target="_blank" >
            {`${t("market_link")} `}
            <FontAwesomeIcon icon={faExternalLinkAlt} />
        </a>}
        </>
    );
};

export default Link;
