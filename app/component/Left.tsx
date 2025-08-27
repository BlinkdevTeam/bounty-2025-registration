"use client";
import Image from "next/image";
import { useState } from "react";
import { IoMdArrowRoundForward, IoMdArrowRoundBack } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../../lib/supabaseClient";
import emailjs from "@emailjs/browser";
import countryCodes from "../../public/data/all_country_codes.json";

const logos = [
  {
    src: "/assets/bounty/logos/ADISSEO_LOGO.png",
    className: "w-[100px] md:w-[140px] lg:w-[180px]",
  },
  {
    src: "/assets/bounty/logos/Big_Dutchman_Logo.svg.png",
    className: "w-[120px] md:w-[160px] lg:w-[200px]",
  },
  {
    src: "/assets/bounty/logos/Boehringer_Logo_RGB_Dark-Green.png",
    className: "w-[110px] md:w-[130px] lg:w-[150px]",
  },
  {
    src: "/assets/bounty/logos/CALYX.png",
    className: "w-[120px] md:w-[140px] lg:w-[150px]",
  },
  {
    src: "/assets/bounty/logos/CEVA_LOGO.png",
    className: "w-[80px] md:w-[90px] lg:w-[95px]",
  },
  {
    src: "/assets/bounty/logos/DSM_FIRMENICH_BLACK_2.png",
    className: "w-[100px] md:w-[110px] lg:w-[120px]",
  },
  {
    src: "/assets/bounty/logos/HIPRA.png",
    className: "w-[110px] md:w-[130px] lg:w-[150px]",
  },
  {
    src: "/assets/bounty/logos/HUVEPHARMA.png",
    className: "w-[120px] md:w-[140px] lg:w-[160px]",
  },
  {
    src: "/assets/bounty/logos/2024_INTERFARMA-NUTRACEUTICALS-INC.-min-2-scaled-2@3x.png",
    className: "w-[160px] md:w-[200px] lg:w-[230px]",
  },
  {
    src: "/assets/bounty/logos/MSD_with tagline.png",
    className: "w-[130px] md:w-[150px] lg:w-[164px]",
  },
  {
    src: "/assets/bounty/logos/MS SCHIPPERS.png",
    className: "w-[140px] md:w-[170px] lg:w-[190px]",
  },
  {
    src: "/assets/bounty/logos/NOVUS.png",
    className: "w-[120px] md:w-[140px] lg:w-[160px]",
  },
  {
    src: "/assets/bounty/logos/ROXELL_with tagline.png",
    className: "w-[150px] md:w-[170px] lg:w-[190px]",
  },
  {
    src: "/assets/bounty/logos/Spanvall.png",
    className: "w-[130px] md:w-[160px] lg:w-[180px]",
  },
];

export default function Home() {
  const [step, setStep] = useState(3);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState<{
    selectedEvents: string[];
    email: string;
    fullName: string;
    contactNumber: string;
    address: string;
    company: string;
    designation: string;
    firstTime: string; // "yes" or "no"
  }>({
    selectedEvents: [],
    email: "",
    fullName: "",
    contactNumber: "",
    address: "",
    company: "",
    designation: "",
    firstTime: "",
  });

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setFormData((prev) => {
      const updatedEvents = checked
        ? [...prev.selectedEvents, value]
        : prev.selectedEvents.filter((event) => event !== value);

      return { ...prev, selectedEvents: updatedEvents };
    });
  };

  const renderSelectedText = () => {
    if (!formData.selectedEvents.length) {
      return "⚠️ Please select at least one event.";
    }

    if (formData.selectedEvents.length === 1) {
      return formData.selectedEvents[0] === "event1"
        ? "September 2, 2025 | Bountry Strategic Suppliers Showcase 2025"
        : "September 3, 2025 | Bountry Strategic Suppliers Showcase 2025";
    }

    if (formData.selectedEvents.length === 2) {
      return `You have selected both events:\n• September 2, 2025 | Bountry Strategic Suppliers Showcase 2025\n• September 3, 2025 | Bountry Strategic Suppliers Showcase 2025`;
    }

    return "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (step === 3 && !formData.selectedEvents.length) {
      errors["selectedEvents"] = "Please select at least one event.";
    }

    if (step === 4) {
      if (!formData.email.trim()) errors.email = "Email is required";
      if (!formData.fullName.trim()) errors.fullName = "Full name is required";
      if (!formData.contactNumber.trim())
        errors.contactNumber = "Contact number is required";
    }

    if (step === 5) {
      if (!formData.address.trim()) errors.address = "Address is required";
      if (!formData.company.trim())
        errors.company = "Company/Affiliation is required";
      if (!formData.designation.trim())
        errors.designation = "Designation is required";
      if (!formData.firstTime)
        errors["firstTime"] =
          "Please specify if it’s your first time attending BS3";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendEmail = async (email: string, fullName: string) => {
    if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      alert("Invalid email address.");
      return;
    }

    const templateParams = {
      email: email, // recipient email
      fullName: fullName, // full name of participant
    };

    try {
      setLoading(true);
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      setSent(true);
    } catch (err) {
      console.error("Email send error:", err);
      alert("Failed to send email.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setShowValidationModal(true);
      return;
    }

    try {
      const { data: existingList, error: fetchError } = await supabase
        .from("bounty_2025_registrations")
        .select("id")
        .eq("email", formData.email);

      if (fetchError) {
        alert("Error checking existing registration.");
        return;
      }

      if (existingList && existingList.length > 0) {
        setFormErrors((prev) => ({
          ...prev,
          email: "This email is already registered.",
        }));
        setStep(4);
        return;
      }

      const { error } = await supabase
        .from("bounty_2025_registrations")
        .insert([
          {
            email: formData.email,
            full_name: formData.fullName,
            contact_number: formData.contactNumber,
            address: formData.address,
            company: formData.company,
            designation: formData.designation,
            first_time: formData.firstTime,
            selected_events: formData.selectedEvents,
          },
        ]);

      if (error) {
        alert("Error submitting the form. Please try again.");
      } else {
        // await handleSendEmail(formData.email, formData.fullName);

        setFormData({
          selectedEvents: [],
          email: "",
          fullName: "",
          contactNumber: "",
          address: "",
          company: "",
          designation: "",
          firstTime: "",
        });

        setStep(3);
        setSent(true); // ✅ Show success UI
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    }
  };

  const nextStep = () => {
    if (step === 3 || step === 4 || step === 5) {
      if (!validateForm()) return;
    }
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 3));

  return (
    <section className="flex flex-col justify-center items-center px-4 w-full">
      <div className="w-full flex flex-col justify-center items-center text-center">
        {/* First logo */}
        <div className="p-4 lg:p-0">
          <Image
            src="/assets/bounty/BOUNTY LOGO.png"
            alt="Bounty Logo"
            width={407}
            height={69}
            className="w-[207px] md:w-[307px] lg:w-[407px] h-auto"
          />
        </div>

        <p className=" text-[22px] mb-8 lg:mb-4 lg:text-[30px]">presents</p>

        <Image
          src="/assets/bounty/BS3_LOGO.png"
          alt="BS3 Logo"
          width={6147}
          height={1694}
          className="w-[5707px] md:w-[5907px] lg:w-[6147px] h-auto"
        />

        <p className="text-[26px] lg:text-[32px] leading-[30px] lg:leading-[40px] tracking-[2px] font-bold my-8 lg:my-0">
          Powering Progress Through Partnership:
          <br />
          Where Innovation Meets Collaboration For
          <br />
          Lasting Impact
        </p>
      </div>

      <section className="flex lg:hidden">
        <div className="flex flex-col gap-8 min-w-[302px] w-full h-full pb-20 mx-auto bg-white rounded-[24px] shadow-md text-gray-600 relative">
          {!sent ? (
            <>
              <div className="p-12">
                {step === 3 && (
                  <div className="grid gap-6 text-black">
                    <div className="w-fit h-auto">
                      <h1 className="text-[30px] font-bold">Event Selection</h1>
                      <div
                        className="w-24 h-1 rounded"
                        style={{
                          background:
                            "linear-gradient(to right, #EF0000, #191919)",
                        }}
                      ></div>
                    </div>
                    <p className="text-[18px] font-bold">
                      Please select the event you’d like to attend:
                    </p>
                    <div className="flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-8">
                        <div className="flex flex-col justify-start items-center gap-6">
                          <div
                            className={`w-[84px] h-[84px] rounded-full flex items-center justify-center ${
                              formData.selectedEvents?.includes("event1")
                                ? "bg-[#EF0000]"
                                : "bg-[#191919]"
                            }`}
                          >
                            <Image
                              src={
                                formData.selectedEvents?.includes("event1")
                                  ? "/assets/bounty/icons/ChickenWhite.png"
                                  : "/assets/bounty/icons/ChickenWhite.png"
                              }
                              alt="Pig Icon"
                              width={80}
                              height={80}
                              className="w-[80px] h-[80px]"
                            />
                          </div>
                          <div className="flex gap-4">
                            <input
                              type="checkbox"
                              id="event1"
                              value="event1"
                              checked={formData.selectedEvents?.includes(
                                "event1"
                              )}
                              onChange={handleCheck}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label
                              htmlFor="event1"
                              className="text-[14px] text-gray-700"
                            >
                              September 2, 2025 | Bountry Strategic Suppliers
                              Showcase 2025
                            </label>
                          </div>
                        </div>

                        <div className="flex flex-col justify-start items-center gap-6">
                          <div
                            className={`w-[84px] h-[84px] rounded-full flex items-center justify-center ${
                              formData.selectedEvents?.includes("event2")
                                ? "bg-[#EF0000]"
                                : "bg-[#191919]"
                            }`}
                          >
                            <Image
                              src={
                                formData.selectedEvents?.includes("event2")
                                  ? "/assets/bounty/icons/eggs2_2.png"
                                  : "/assets/bounty/icons/eggs2_2.png"
                              }
                              alt="Egg Icon"
                              width={80}
                              height={80}
                              className="w-[80px] h-[80px]"
                            />
                          </div>
                          <div className="flex gap-4">
                            <input
                              type="checkbox"
                              id="event2"
                              value="event2"
                              checked={formData.selectedEvents?.includes(
                                "event2"
                              )}
                              onChange={handleCheck}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label
                              htmlFor="event2"
                              className="text-[14px] text-gray-700"
                            >
                              September 3, 2025 | Bountry Strategic Suppliers
                              Showcase 2025
                            </label>
                          </div>
                        </div>
                      </div>

                      <p
                        className={`text-[14px] italic mt-4 whitespace-pre-line font-medium ${
                          !formData.selectedEvents ||
                          formData.selectedEvents.length === 0
                            ? "text-red-500"
                            : "text-[#787878]"
                        }`}
                      >
                        {renderSelectedText()}
                      </p>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="grid gap-6 text-black">
                    <div className="w-fit h-auto">
                      <h1 className="text-[30px] font-bold">
                        Personal Information
                      </h1>
                      <div
                        className="w-24 h-1 rounded"
                        style={{
                          background:
                            "linear-gradient(to right, #EF0000, #191919)",
                        }}
                      ></div>
                    </div>
                    <p className="text-[14px] italic">
                      Fill in your personal information.
                    </p>
                    <div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[14px] font-medium">
                          Email Address
                        </label>
                        <input
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="email@example.com"
                          className={`text-[14px] border ${
                            formErrors.email
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded px-4 py-2 w-full`}
                        />
                        <span
                          className={`text-[12px] text-red-500 transition-opacity duration-200 ${
                            formErrors.email ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          {formErrors.email || "Placeholder"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex flex-col gap-2 w-full">
                          <label className="text-[14px] font-medium">
                            Full Name
                          </label>
                          <input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`text-[14px] border ${
                              formErrors.fullName
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded px-4 py-2 w-full uppercase`}
                            placeholder="Full Name"
                          />
                          <span
                            className={`text-[12px] text-red-500 transition-opacity duration-200 ${
                              formErrors.fullName ? "opacity-100" : "opacity-0"
                            }`}
                          >
                            {formErrors.fullName || "Placeholder"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[14px] font-medium">
                          Phone Number
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            className={`w-full border ${
                              formErrors.contactNumber
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded px-4 py-2 uppercase`}
                            placeholder="Enter number"
                          />
                        </div>
                        <span
                          className={`text-[12px] text-red-500 transition-opacity duration-200 ${
                            formErrors.contactNumber
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        >
                          {formErrors.contactNumber || "Placeholder"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <>
                    {/* Address */}
                    <div className="flex flex-col gap-2">
                      <label className="block text-[14px] font-medium mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="e.g. 245 JP Rizal St., Barangay Sto. Niño, Marikina City, Metro Manila, 1800"
                        className={`uppercase text-[14px] border ${
                          formErrors.address
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      <span
                        className={`text-[12px] text-red-500 transition-opacity duration-200 ${
                          formErrors.address ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {formErrors.address || "Placeholder"}
                      </span>
                    </div>
                    {/* Company / Organization */}
                    <div className="flex flex-col gap-2">
                      <label className="block text-[14px] font-medium mb-1">
                        Company / Organization Name
                      </label>
                      <input
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Name of company / organization"
                        className={`text-[14px] border ${
                          formErrors.company
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase`}
                      />
                      <span
                        className={`text-[12px] text-red-500 transition-opacity duration-200 ${
                          formErrors.company ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {formErrors.company || "Placeholder"}
                      </span>
                    </div>
                    {/* Designation */}
                    <div className="flex flex-col gap-2">
                      <label className="block text-[14px] font-medium mb-1">
                        Designation / Job Title
                      </label>
                      <input
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        placeholder="Job Title"
                        className={`text-[14px] border ${
                          formErrors.designation
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase`}
                      />
                      <span
                        className={`text-[12px] text-red-500 transition-opacity duration-200 ${
                          formErrors.designation ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {formErrors.designation || "Placeholder"}
                      </span>
                    </div>
                    {/* First Time event */}
                    <div className="flex flex-col gap-2">
                      <label className="block text-[14px] font-medium mb-1">
                        Is this your first time attending?
                      </label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 text-[14px]">
                          <input
                            type="radio"
                            name="firstTime"
                            value="yes"
                            checked={formData.firstTime === "yes"}
                            onChange={handleChange}
                            className="text-blue-500 focus:ring-blue-500"
                          />
                          Yes
                        </label>
                        <label className="flex items-center gap-2 text-[14px]">
                          <input
                            type="radio"
                            name="firstTime"
                            value="no"
                            checked={formData.firstTime === "no"}
                            onChange={handleChange}
                            className="text-blue-500 focus:ring-blue-500"
                          />
                          No
                        </label>
                      </div>

                      <span
                        className={`text-[12px] text-red-500 transition-opacity duration-200 ${
                          formErrors.firstTime ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {formErrors.firstTime || "Placeholder"}
                      </span>
                    </div>
                  </>
                )}

                {step === 5 && !sent && (
                  <div className="">
                    <button
                      onClick={handleSubmit}
                      className={`w-full mt-0 py-3 px-4 rounded-[10px] text-white ${
                        loading
                          ? "bg-[#0060DC] cursor-not-allowed"
                          : "bg-[linear-gradient(to_right,_#EF0000,_#191919)] hover:opacity-90 cursor-pointer"
                      }`}
                    >
                      {loading ? "Submitting..." : "Register"}
                    </button>
                  </div>
                )}
              </div>

              {/* Fixed Bottom Navigation */}
              <div className="absolute bottom-0 left-0 w-full px-12 py-6">
                <div className="w-full flex flex-col items-center gap-4">
                  <div className="flex items-center gap-4">
                    {step > 1 && (
                      <div
                        className="cursor-pointer w-[56px] h-[56px] flex justify-center items-center border border-[#006AD4] rounded-full"
                        onClick={prevStep}
                      >
                        <IoMdArrowRoundBack className="text-[#006AD4] w-6 h-6" />
                      </div>
                    )}
                    {step < 5 && (
                      <div
                        className="cursor-pointer w-[56px] h-[56px] flex justify-center items-center border border-[#006AD4] rounded-full"
                        onClick={nextStep}
                      >
                        <IoMdArrowRoundForward className="text-[#006AD4] w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${
                          step - 2 === i ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-full h-auto grid grid-rows-2">
                <div className="flex flex-col items-center mt-12">
                  <Image
                    src="/assets/bounty/successfull.png"
                    alt="successfull"
                    width={320}
                    height={320}
                  />
                </div>
                <div className="flex flex-col justify-center items-start mt-12 px-12">
                  <p className="text-[25px] font-bold leading-[24px]">
                    You have successfully submitted your registration!
                  </p>
                  <p className="text-[18px] leading-[24px] mt-4">
                    Please wait for your registration to be approved.
                  </p>

                  {/* <a
                      href="https://www.blinkcreativestudio.com/Species-Advancement-Tech-Forum"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex justify-center items-center mt-6 text-white px-4 py-4 rounded bg-[linear-gradient(to_right,_#0060DC,_#00E071)] hover:opacity-90 cursor-pointer"
                    >
                      Go to website
                    </a> */}
                </div>
              </div>
            </>
          )}

          {showValidationModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-red-600">
                  Missing Required Fields
                </h2>
                <p className="text-sm text-gray-700 mb-6">
                  Please complete all required fields before submitting the
                  form.
                </p>
                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                    onClick={() => setShowValidationModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Date + Location box */}
      <div className="relative flex flex-col justify-center items-center bg-[#ffffff] w-fit py-4 px-8 lg:px-14 my-10">
        <div className="absolute -top-4 -left-4 w-full h-20 bg-[#EF0000] -z-10"></div>
        <div className="absolute -bottom-4 -right-4 w-full h-20 bg-black -z-10"></div>

        <h4 className="text-[16px] md:text-[26px] lg:text-[32px] font-bold leading-[22px] md:leading-[34px] tracking-[2px] text-center uppercase">
          September 2-3, 2025
          <br />
          marquis events place, bgc, taguig
          <br />8 : 00 am - 5 : 30 pm
        </h4>
      </div>

      {/* Logos Grid */}
      <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
        {logos.map((logo, index) => (
          <Image
            key={index}
            src={logo.src}
            alt={`Logo ${index + 1}`}
            width={300} // dummy, just for Next.js requirement
            height={150}
            className={`${logo.className} h-auto object-contain`}
          />
        ))}
      </div>
    </section>
  );
}
