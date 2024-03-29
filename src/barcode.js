import React, { useEffect, useState } from "react";
import "./barcode.css"
import axios from "axios";
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import copy from 'clipboard-copy';
import * as XLSX from 'xlsx';
import { LazyLoadImage, LazyLoadComponent } from 'react-lazy-load-image-component';
import CachedIcon from '@mui/icons-material/Cached';
import { useSelector, useDispatch } from 'react-redux';
import Barcode from 'react-jsbarcode';
const Barcode1 = () => {
    const [companyCode, setCompanyCode] = useState(1)
    const [methodCode, setMethodCode] = useState(1)
    const [bottleSizeCode, setBottleSizeCode] = useState(1)
    const [reagentType, setReagentType] = useState(0)
    const [expiryYear, setExpiryYear] = useState(0)
    const [expiryMonth, setExpiryMonth] = useState(0)
    const [expiryDay, setExpiryDay] = useState(0)
    const [expiry_Month, setExpiry_Month] = useState(1)
    const [lotNumber, setLotNumber] = useState(1)
    const [sequenceNumber, setSequenceNumber] = useState(0)
    const [reagentTypeCode, setReagentTypeCode] = useState(1)
    const [dayProduce, setDayProduce] = useState("")
    const [monthProduce, setMonthProduce] = useState("")
    const [yearProduce, setYearProduce] = useState("")
    const [selectExpiryType, setSelectExpiryType] = useState("1")
    const [minSequenceNumber, setMinSequenceNumber] = useState(1)
    const [maxSequenceNumber, setMaxSequenceNumber] = useState(minSequenceNumber)
    const [minSequenceNumber_once, setMinSequenceNumber_once] = useState(1)
    const [maxSequenceNumber_once, setMaxSequenceNumber_once] = useState(1)
    const [code, setCode] = useState({})
    const [dataExel, setDataExel] = useState([])
    const [isCopy, setIsCopy] = useState(false);
    const [isExport, setIsExport] = useState(false);
    const [reloadClicked, setReloadClicked] = useState(false);
    const [selectedTab, setSelectedTab] = useState(1);
    const [changeImage, setChangeImage] = useState("1");
    const [barcode, setBarcode] = useState("001011141000100018")
    const [barcodeInfo, setBarcodeInfo] = useState({})
    const token = localStorage.getItem("token")
    const uid = localStorage.getItem("uid")
    //console.log(token)
    const exportToExcel = async () => {
        try {

            const dataBarcode = {
                CompanyCode: companyCode,
                MethodCode: methodCode,
                BottleSizeCode: bottleSizeCode,
                ReagentTyprCode: reagentTypeCode,
                DayProduce: dayProduce,
                MonthProduce: monthProduce,
                YearProduce: yearProduce,
                ExpiryMonth: expiryMonth,
                ExpiryDay: expiryDay,
                ExpiryYear: expiryYear,
                Expiry_Month: expiry_Month,
                LotNumber: lotNumber,
                MinSequenceNumber: minSequenceNumber,
                MaxSequenceNumber: maxSequenceNumber,
                SequenceNumber: sequenceNumber,
            }
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'x-user-id': uid
                },
            };
            try {
                axios.post("http://tractorserver.myddns.me:8000/barcode/genator", dataBarcode, config)
                    .then((res) => {
                        if (res.data.code === 200) {
                            //setCode(data.data)

                            if (res.data.data !== null || res.data.data.length != 0) {
                                const data = transformArray(res.data.data);
                                const ws = XLSX.utils.json_to_sheet(data);
                                const wb = XLSX.utils.book_new();
                                XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                                XLSX.writeFile(wb, `${res.data.methodecode}_${res.data.bottlesize}_${res.data.reagenttype}_${res.data.dayProduce}_from_${res.data.min}_to_${res.data.max}.xlsx`);
                                alert('Export file thành công! Kiểm tra trong thư mục Tải xuống');
                            } else {
                                alert("Có lỗi xảy ra!")
                            }


                        }
                        else if (res.data.code === 204) {
                            alert("Ngày tháng năm không hợp lệ!")
                        }
                    })
                    .catch((err) => {
                        throw err
                    })
            } catch (error) {
                console.error(error)
            }


        } catch (error) {
            console.error('Lỗi khi ghi file:', error);
            alert('Đã xảy ra lỗi khi ghi file Excel!');
        }
    };

    const handleSubmit = async () => {
        const err_arr = []
        if (companyCode == 0) {
            err_arr.push("Company Code")
        }
        if (dayProduce == 0) {
            err_arr.push("Day Produce")
        }
        if (monthProduce == 0) {
            err_arr.push("Month Produce")
        }
        if (yearProduce == 0) {
            err_arr.push("Year Produce")
        }
        if (expiry_Month == 0) {
            err_arr.push("Expiry Month")
        }
        if (minSequenceNumber == 0) {
            err_arr.push("Min Sequence Number")
        }

        if (err_arr.length > 0) {
            const errorMessage = "Nhập đầy đủ thông tin sau: " + err_arr.join(', ');
            alert(errorMessage);
            return
        }

        const dataBarcode = {
            CompanyCode: companyCode,
            MethodCode: methodCode,
            BottleSizeCode: bottleSizeCode,
            ReagentTyprCode: reagentTypeCode,
            DayProduce: dayProduce,
            MonthProduce: monthProduce,
            YearProduce: yearProduce,
            ExpiryMonth: expiryMonth,
            ExpiryDay: expiryDay,
            ExpiryYear: expiryYear,
            Expiry_Month: expiry_Month,
            LotNumber: lotNumber,
            MinSequenceNumber: minSequenceNumber_once,
            MaxSequenceNumber: maxSequenceNumber_once,
            SequenceNumber: sequenceNumber,
        }
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'x-user-id': uid
            },
        };
        try {
            const data = await axios.post("http://tractorserver.myddns.me:8000/barcode/genator", dataBarcode, config)
            // console.log(data.data)

            if (data.data) {
                if (data.data.code === 200) {
                    setCode(data.data)
                    // setDataExel(data.data.data)
                    if (data.data.data.length > 0) {
                        setIsExport(true)
                    }

                }
                else if (data.data.code === 204) {
                    alert("Ngày tháng năm không hợp lệ!")
                }
            }
        } catch (error) {

        }

    }

    const handleSetToday = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        //  const formattedDate = `${year}-${month}-${day}`;
        setDayProduce(day)
        setMonthProduce(month)
        setYearProduce(year)
    }
    const handleCopy = (input) => {
        copy(input);
        setIsCopy(true);
    }

    const handleMinChange = (e) => {
        const newMin = parseInt(e.target.value);


        setMinSequenceNumber(newMin);
        if (newMin > maxSequenceNumber) {
            setMaxSequenceNumber(newMin);
        }


    };
    const handleMinchange_once = (e) => {
        const newMin = parseInt(e.target.value);
        setMinSequenceNumber_once(newMin);
        setMaxSequenceNumber_once(newMin)
    }
    const handleMaxChange = (e) => {
        const newMax = parseInt(e.target.value);
        setMaxSequenceNumber(newMax);
    };
    const transformArray = (inputArray) => {
        return inputArray.map((code, index) => ({
            "Số thứ tự lọ": code.bottleLot,
            "Bar Code": code.code
        }));
    };
    const handleReload = (id, item) => {
        console.log(id)
        const element = document.getElementById(id)

        element.innerHTML = '  <img style="width: 250px; height: 60px;" alt="Barcode Generator TEC-IT -' + item + '" src="https://barcode.tec-it.com/barcode.ashx?data=' + item + '&code=Code25IL" style= "maxWidth: 250px" /> '

        // console.log('  <img alt="Barcode Generator TEC-IT -' + item + ' src="https://barcode.tec-it.com/barcode.ashx?data=' + item + '&code=Code25IL" style= "maxWidth: 250px" /> ')
        // console.log(`https://barcode.tec-it.com/barcode.ashx?data=${item}&code=Code25IL`)
        //  element.src = `https://barcode.tec-it.com/barcode.ashx?data=${item}&code=Code25IL`
    }
    useEffect(() => {
        // Gọi hàm handleSetToday khi component được mount
        handleSetToday();
    }, []); // Dấu ngoặc vuông rỗng đảm bảo useEffect chỉ chạy một lần sau khi component được mount

    const handleRead = async () => {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'x-user-id': uid
            },
        };
        if (barcode.length != 18) {
            alert("Mã vạch phải đủ 18 kí tự!")
            return
        }
        try {
            const data = await axios.get(`http://tractorserver.myddns.me:8000/barcode/read?code=${barcode}`, config)
            // console.log(data)
            if (data.data) {
                // console.log(data.data.methodcode)
                setBarcodeInfo({
                    companycode: data.data.companycode,
                    methodcode: data.data.methodecode,
                    bottlesize: data.data.bottlesize,
                    reagenttype: data.data.reagenttype,
                    lotnumber: data.data.lotnumber,
                    bottlesequence: data.data.bottlesequence,
                    date: data.data.date
                })
            }
            // console.log(barcodeInfo.methodcode)
        } catch (error) {
            console.error(error)
        }

    }
    useEffect(() => {
        switch (methodCode) {
            case "1":
                setExpiry_Month(24)
                break;
            case "20":
                setExpiry_Month(18)
                break;
            case "5":
                setExpiry_Month(18)
                break;

            case "19":
                setExpiry_Month(18)
                break;
            case "62":
                setExpiry_Month(18)
                break;
            case "63":
                setExpiry_Month(18)
                break;
            case "10":
                setExpiry_Month(18)
                break;
            case "13":
                setExpiry_Month(18)
                break;
            case "35":
                setExpiry_Month(18)
                break;
            case "36":
                setExpiry_Month(12)
                break;
            case "16":
                setExpiry_Month(18)
                break;
            case "11":
                setExpiry_Month(18)
                break;
            case "12":
                setExpiry_Month(18)
                break;
            case "30":
                setExpiry_Month(18)
                break;
            case "29":
                setExpiry_Month(24)
                break;
            case "32":
                setExpiry_Month(24)
                break;
            case "31":
                setExpiry_Month(18)
                break;
            case "37":
                setExpiry_Month(24)
                break;
            case "2":
                setExpiry_Month(18)
                break;
            case "14":
                setExpiry_Month(12)
                break;
            case "18":
                setExpiry_Month(12)
                break;
            case "25":
                setExpiry_Month(18)
                break;
            default:
                setExpiry_Month(24)

        }
    }, [methodCode])
    return (
        <div className="container">
            <div >
                <a href='https://www.tec-it.com' title='Barcode Software by TEC-IT' target='_blank'>

                </a>
            </div>
            <div className={`tab_container`}>
                <div onClick={() => setSelectedTab(1)} className={`tab_container-item ${selectedTab == 1 && "active"}`}>Tạo mã lẻ</div>
                <div onClick={() => setSelectedTab(2)} className={`tab_container-item ${selectedTab == 2 && "active"}`}>Tạo nhiều mã</div>
                <div onClick={() => setSelectedTab(3)} className={`tab_container-item ${selectedTab == 3 && "active"}`}>Đọc</div>
            </div>
            {selectedTab == 1 &&
                <div className="container_barcode">
                    {/*
                        <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Company Code (Không đổi)</span>
                        <input type="text" value={companyCode} onChange={(e) => setCompanyCode(e.target.value)}></input>
                    </div>
                    */}

                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Method (Loại hóa chất)</span>
                        <select value={methodCode} onChange={(e) => setMethodCode(e.target.value)}>
                            <option value={1}>ALB (Albumin)</option>
                            <option value={20}>ALT (GPT)</option>
                            <option value={5}>AMY (alpha - Amylase)</option>
                            <option value={19}>AST (GOT)</option>
                            <option value={6}>BIL-D (Bilirubin Direct)</option>
                            <option value={7}>BIL-T (Bilirubin Total)</option>
                            <option value={10}>TC (Total Cholesterol)</option>
                            <option value={13}>CK-MB</option>
                            <option value={35}>CRE (Creatinine)</option>
                            <option value={36}>CRP</option>
                            <option value={16}>GGT</option>
                            <option value={11}>HDL-C (HDL-Cholesterol)</option>
                            <option value={12}>LDL-C (LDL - Cholesterol)</option>
                            <option value={30}>TG (Total Triglycerides)</option>
                            <option value={29}>TP (Total Protein)</option>
                            <option value={32}>UA (Uric Acid)</option>
                            <option value={31}>UN (Urea)</option>
                            <option value={37}>HbA1c</option>
                            <option value={2}>ALP</option>
                            <option value={14}>CK</option>
                            <option value={18}>GLU (Glucose)</option>
                            <option value={25}>LDH</option>

                        </select>


                        <span >Code  : {formatNumber(methodCode)}  </span>
                        <span >Tháng hết hạn của {getMethodNameByValue(methodCode)} : {expiry_Month} tháng!</span>




                    </div>
                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Bottle size ( Kích cỡ lọ)</span>
                        <select value={bottleSizeCode} onChange={(e) => setBottleSizeCode(e.target.value)}>
                            <option value={1}>20ml (square)</option>
                            <option value={3}>70ml</option>
                        </select>
                    </div>
                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Reagent type (Loại thuốc thử)</span>
                        <select value={reagentTypeCode} onChange={(e) => setReagentTypeCode(e.target.value)}>
                            <option value={1}>R1</option>
                            <option value={2}>R2</option>
                        </select>
                    </div>
                    {/**  <div className="barcode_item" style={{ display: "none" }}>

                        <select value={selectExpiryType} onChange={(e) => setSelectExpiryType(e.target.value)}>
                            <option value={1}>Thời gian chính xác</option>
                            <option value={2}>Từ thời gian sản xuất</option>
                        </select>
                    </div> */}



                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Ngày sản xuất:</span>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Ngày sản xuất</span>
                                <input style={{ width: "100px" }} type="number" required value={dayProduce} onChange={(e) => setDayProduce(e.target.value)}></input>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Tháng sản xuất</span>
                                <input style={{ width: "100px" }} type="number" required value={monthProduce} onChange={(e) => setMonthProduce(e.target.value)}></input>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Năm sản xuất</span>
                                <input style={{ width: "100px" }} type="number" required value={yearProduce} onChange={(e) => setYearProduce(e.target.value)}></input>
                            </div>
                            <button onClick={handleSetToday} style={{ "width": "70px", }}>Hôm nay</button>
                        </div>
                    </div>


                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Lot Number (3 chữ số cuối cùng của lot)</span>
                        <input type="text" required value={lotNumber} onChange={(e) => setLotNumber(e.target.value)}></input>
                    </div>
                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Số thứ tự lọ:
                        </span>
                        <input type="number" required min={0} value={minSequenceNumber_once} onChange={handleMinchange_once}></input>
                        {/**
                         *  <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Min Sequence Number (Bắt đầu từ)</span>
                                <input style={{ width: "100px" }} type="number" min={0} value={minSequenceNumber} onChange={handleMinChange}></input>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Max Sequence Number (Kết thúc)</span>
                                <input style={{ width: "100px" }} type="number" min={0} value={maxSequenceNumber} onChange={handleMaxChange}></input>
                            </div>
                        </div>
                         */}

                    </div>
                    <div className="barcode_item" style={{ "width": "150px", "margin": "auto", }}>
                        <button style={{ marginBottom: "10px" }} onClick={handleSubmit}>Tạo mã</button>

                        {/** 
                        * {isExport && <button onClick={exportToExcel}>Xuất File Exels</button>}
                       */}


                    </div>
                    {isExport &&
                        <div className="barcode_item" >
                            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Ngày hết hạn ước tính (ngày-tháng-năm): {convertDateStringToCustomFormat(code?.date)}</span>
                        </div>}


                    <div className="barcode_item barcode_render_contain" style={{ "margin": "auto" }} >
                        {isExport &&
                            <select style={{ width: "100px", marginBottom: "10px" }} value={changeImage} onChange={(e) => setChangeImage(e.target.value)}>
                                <option value={1}>Js Barcode </option>
                                <option value={2}>Tec-it</option>
                            </select>}

                        {code?.data?.length !== 0 && code?.data?.map((item, index) => (
                            <div key={index} className="barcode_render">
                                <div className="barcode_render_img" >
                                    <LazyLoadComponent delayTime={200}>

                                        {/**
                     * 
                     */}
                                        {changeImage == "2" ? (
                                            <div style={{ width: '250px', height: "60px" }} >
                                                <div id={`img_code_${index}`}>
                                                    <img
                                                        alt={`Barcode Generator TEC-IT - ${item}`}
                                                        src={`https://barcode.tec-it.com/barcode.ashx?data=${item.code}&code=Code25IL`}
                                                        style={{ "width": "250px", height: "60px" }}

                                                    />
                                                </div>


                                                <p style={{ margin: "0 0 0 0" }}>
                                                    <span class="tooltip1" data-tooltip="Reload Codebar Image" data-tooltip-pos="up" data-tooltip-length="medium"> <CachedIcon style={{ cursor: "pointer" }} onClick={() => handleReload(`img_code_${index}`, item.code)} /></span>
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="jsbarcode" >
                                                <Barcode value={item.code} options={{ format: 'itf', height: "80px", width: "3px" }} renderer="image" />

                                            </div>

                                        )
                                        }




                                    </LazyLoadComponent>
                                    <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
                                        <p>{item.code}</p>

                                        <p>
                                            <span class="tooltip1" data-tooltip="Copy Number Code " data-tooltip-pos="up" data-tooltip-length="medium"> <ContentPasteIcon onClick={() => handleCopy(item.code)} style={{ cursor: "pointer" }} /></span>

                                        </p>
                                    </div>

                                </div>
                                {/*
                                    <div>
                                    <ul className="barcode_render_detail" style={{ marginBottom: "0", fontSize: "14px" }}>
                                        <li><span>Company Code: </span>{extractSubstring(item, 0, 2)}</li>
                                        <li><span>Method:</span> {getMethodNameByCode(extractSubstring(item, 3, 4))}</li>
                                        <li><span>Bottle Size:</span> {getBottleSizeNameByCode(extractSubstring(item, 5, 5))}</li>
                                        <li><span>Reagent Type:</span> {getReagentTypeNameByCode(extractSubstring(item, 6, 6))}</li>
                                        <li><span>Day Expiry(d/m/y):</span> {convertDateStringToCustomFormat(code?.date)}</li>
                                        <li><span>Lot Number:</span> {extractSubstring(item, 10, 12)} </li>
                                        <li><span>Bottle Sequence Number:</span> {extractSubstring(item, 13, 16)}</li>
                                    </ul>
                                </div>
                                */}

                            </div>
                        ))}
                    </div>
                </div>
            }
            {selectedTab == 2 &&
                <div className="container_barcode">
                    {/*
                    <div className="barcode_item">
                    <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Company Code (Không đổi)</span>
                    <input type="text" value={companyCode} onChange={(e) => setCompanyCode(e.target.value)}></input>
                </div>
                */}

                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Method (Loại hóa chất)</span>
                        <select value={methodCode} onChange={(e) => setMethodCode(e.target.value)}>
                            <option value={1}>ALB (Albumin)</option>
                            <option value={20}>ALT (GPT)</option>
                            <option value={5}>AMY (alpha - Amylase)</option>
                            <option value={19}>AST (GOT)</option>
                            <option value={6}>BIL-D (Bilirubin Direct)</option>
                            <option value={7}>BIL-T (Bilirubin Total)</option>
                            <option value={10}>TC (Total Cholesterol)</option>
                            <option value={13}>CK-MB</option>
                            <option value={35}>CRE (Creatinine)</option>
                            <option value={36}>CRP</option>
                            <option value={16}>GGT</option>
                            <option value={11}>HDL-C (HDL-Cholesterol)</option>
                            <option value={12}>LDL-C (LDL - Cholesterol)</option>
                            <option value={30}>TG (Total Triglycerides)</option>
                            <option value={29}>TP (Total Protein)</option>
                            <option value={32}>UA (Uric Acid)</option>
                            <option value={31}>UN (Urea)</option>
                            <option value={37}>HbA1c</option>
                            <option value={2}>ALP</option>
                            <option value={14}>CK</option>
                            <option value={18}>GLU (Glucose)</option>
                            <option value={25}>LDH</option>

                        </select>
                        <span >Code  : {formatNumber(methodCode)}  </span>
                        <span >Tháng hết hạn của {getMethodNameByValue(methodCode)} : {expiry_Month} tháng!</span>
                    </div>
                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Bottle size ( Kích cỡ lọ)</span>
                        <select value={bottleSizeCode} onChange={(e) => setBottleSizeCode(e.target.value)}>
                            <option value={1}>20ml (square)</option>
                            <option value={3}>70ml</option>
                        </select>
                    </div>
                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Reagent type (Loại thuốc thử)</span>
                        <select value={reagentTypeCode} onChange={(e) => setReagentTypeCode(e.target.value)}>
                            <option value={1}>R1</option>
                            <option value={2}>R2</option>
                        </select>
                    </div>
                    {/**  <div className="barcode_item" style={{ display: "none" }}>

                    <select value={selectExpiryType} onChange={(e) => setSelectExpiryType(e.target.value)}>
                        <option value={1}>Thời gian chính xác</option>
                        <option value={2}>Từ thời gian sản xuất</option>
                    </select>
                </div> */}



                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Ngày sản xuất:</span>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Ngày sản xuất</span>
                                <input style={{ width: "100px" }} type="number" value={dayProduce} onChange={(e) => setDayProduce(e.target.value)}></input>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Tháng sản xuất</span>
                                <input style={{ width: "100px" }} type="number" value={monthProduce} onChange={(e) => setMonthProduce(e.target.value)}></input>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Năm sản xuất</span>
                                <input style={{ width: "100px" }} type="number" value={yearProduce} onChange={(e) => setYearProduce(e.target.value)}></input>
                            </div>
                            <button onClick={handleSetToday} style={{ "width": "70px", }}>Hôm nay</button>
                        </div>
                    </div>


                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Lot Number (3 chữ số cuối cùng của lot)</span>
                        <input type="text" value={lotNumber} onChange={(e) => setLotNumber(e.target.value)}></input>
                    </div>
                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Số thứ tự lọ:
                        </span>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Bắt đầu từ</span>
                                <input style={{ width: "100px" }} type="number" min={0} value={minSequenceNumber} onChange={handleMinChange}></input>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>Kết thúc</span>
                                <input style={{ width: "100px" }} type="number" min={0} value={maxSequenceNumber} onChange={handleMaxChange}></input>
                            </div>
                        </div>
                        {/**<input type="number" min={0} value={minSequenceNumber} onChange={handleMinchange_once}></input> */}
                        {/**
                     * 
                     */}

                    </div>
                    <div className="barcode_item" style={{ "width": "150px", "margin": "auto", }}>
                        <button onClick={exportToExcel}>Xuất File Exels</button>

                        {/** 
                    * {isExport && }
                   */}

                        {/*  */}
                    </div>



                </div>
            }
            {selectedTab == 3 &&
                <div className="container_barcode">
                    <div className="barcode_item">
                        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Nhập số mã vạch để trích xuất thông tin</span>
                        <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)}></input>
                    </div>
                    <button onClick={() => handleRead()} style={{ "width": "70px", }}>Đọc</button>
                    {barcodeInfo != null &&
                        <ul className="barcode_render_detail" style={{ marginBottom: "0", fontSize: "14px" }}>
                            <li><span>Company Code: </span>{barcodeInfo.companycode}</li>
                            <li><span>Method:</span> {barcodeInfo.methodcode}</li>
                            <li><span>Bottle Size:</span> {barcodeInfo.bottlesize}</li>
                            <li><span>Reagent Type:</span> {barcodeInfo.reagenttype}</li>
                            <li><span>Day Expiry(d/m/y):</span> {barcodeInfo.date != null && convertDateStringToCustomFormat(barcodeInfo.date)} </li>
                            <li><span>Lot Number:</span> {barcodeInfo.lotnumber} </li>
                            <li><span>Bottle Sequence Number:</span> {barcodeInfo.bottlesequence}</li>
                        </ul>}

                </div>
            }



        </div>
    )
}




function formatNumber(num) {
    if (num >= 1 && num <= 9) {
        return "0" + num;
    } else {
        return num.toString();
    }
}

function getMethodNameByCode(code) {
    const methodOptions = [
        { value: 1, label: 'ALB (Albumin)' },
        { value: 20, label: 'ALTGPT (ALT)' },
        { value: 5, label: 'AMY_IF (Amylase)' },
        { value: 19, label: 'ASTGOT (AST)' },
        { value: 48, label: 'BIL-Dv' },
        { value: 49, label: 'BIL-Tv' },
        { value: 10, label: 'TC-CHO (Total Cholesterol)' },
        { value: 13, label: 'CK-MB' },
        { value: 15, label: 'CRE_Ja' },
        { value: 36, label: 'CRP' },
        { value: 8, label: 'Ca_A3' },
        { value: 16, label: 'GGT' },
        { value: 17, label: 'GNU_HK' },
        { value: 11, label: 'HDL-C (HDL-Cholesterol)' },
        { value: 12, label: 'LDN-C (LDL-Cholesterol)' },
        { value: 30, label: 'TG (Total Triglycerides)' },
        { value: 29, label: 'TP (Total Protein)' },
        { value: 32, label: 'UA (Uric Acid)' },
        { value: 31, label: 'UREA (Urea)' },
        { value: 37, label: 'HbA1c' },
        { value: 2, label: 'ALP' },
        { value: 14, label: 'CK' },
        { value: 35, label: 'CRE (Creatinine)' },
        { value: 6, label: 'BIL-D (Bilirubin Direct)' },
        { value: 18, label: 'GLU (Glucose)' },
        { value: 25, label: 'LDH (Lactate Dehydrogenase)' },
        { value: 7, label: 'BIL-T (Bilirubin Total)' },
    ];

    const selectedMethod = methodOptions.find(method => method.value.toString() === code.toString());
    //  console.log(selectedMethod)
    return selectedMethod ? selectedMethod.label : null;
}

function getBottleSizeNameByCode(code) {
    const bottleSizeOptions = [
        { code: "1", name: '20ml (square)' },
        { code: "7", name: '20ml (round)' },
        { code: "4", name: '40ml' },
        { code: "5", name: '50ml' },
        { code: "3", name: '70ml' },
        { code: "6", name: '100ml' },
    ];

    const selectedBottleSize = bottleSizeOptions.find(size => size.code.toString() === code.toString());

    return selectedBottleSize ? selectedBottleSize.name : null;
}

function getReagentTypeNameByCode(code) {
    const reagentTypeOptions = [
        { code: "1", name: 'R1' },
        { code: "2", name: 'R2' },
        { code: "3", name: 'R3' },
        { code: "4", name: 'R4' },
        { code: "5", name: 'DILUENT' },
        { code: "6", name: 'WASH SOLUTION' },
    ];

    const selectedReagentType = reagentTypeOptions.find(type => type.code.toString() === code.toString());

    return selectedReagentType ? selectedReagentType.name : null;
}

function extractSubstring(inputString, a, b) {
    // console.log(inputString)
    // Kiểm tra a và b để đảm bảo là số và không âm
    if (typeof a !== 'number' || typeof b !== 'number' || a < 0 || b < 0) {
        return "Vui lòng nhập số không âm cho vị trí a và b.";
    }

    // Trích xuất phần của chuỗi từ vị trí a đến vị trí b
    const result = inputString.slice(a, b + 1);
    //console.log(result)
    return result;
}
function convertDateStringToCustomFormat(dateString) {
    const originalDate = new Date(dateString);

    // Kiểm tra xem chuỗi ngày hợp lệ hay không
    if (isNaN(originalDate.getTime())) {
        return "Ngày không hợp lệ";
    }

    const day = originalDate.getDate();
    const month = originalDate.getMonth() + 1; // Tháng bắt đầu từ 0
    const year = originalDate.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
}
function getMethodNameByValue(value) {
    const valueInt = parseInt(value)
    const methodOptions = [
        { value: 1, label: 'ALB (Albumin)' },
        { value: 20, label: 'ALT (GPT)' },
        { value: 5, label: 'AMY (alpha - Amylase)' },
        { value: 19, label: 'AST (GOT)' },
        { value: 6, label: 'BIL-D (Bilirubin Direct)' },
        { value: 7, label: 'BIL-T (Bilirubin Total)' },
        { value: 10, label: 'TC (Total Cholesterol)' },
        { value: 13, label: 'CK-MB' },
        { value: 35, label: 'CRE (Creatinine)' },
        { value: 36, label: 'CRP' },
        { value: 16, label: 'GGT' },
        { value: 11, label: 'HDL-C (HDL-Cholesterol)' },
        { value: 12, label: 'LDL-C (LDL - Cholesterol)' },
        { value: 30, label: 'TG (Total Triglycerides)' },
        { value: 29, label: 'TP (Total Protein)' },
        { value: 32, label: 'UA (Uric Acid)' },
        { value: 31, label: 'UN (Urea)' },
        { value: 37, label: 'HbA1c' },
        { value: 2, label: 'ALP' },
        { value: 14, label: 'CK' },
        { value: 18, label: 'GLU (Glucose)' },
        { value: 25, label: 'LDH' },
    ];

    const selectedMethod = methodOptions.find(method => method.value === valueInt);

    return selectedMethod ? selectedMethod.label : null;
}
export default Barcode1