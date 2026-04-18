import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Briefcase, CircleDollarSign, User } from "lucide-react";
import "./professionCraftsmen.css";
import { getCraftsmanImage } from "../utils/getCraftsmanImage";
import {
  ArrowLeft,
  Search,
  Clock3,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");
const ITEMS_PER_PAGE = 10;

function readJsonSafe(response) {
  return response.json().catch(() => null);
}

function extractCraftsmen(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.craftsmen)) return payload.craftsmen;
  if (Array.isArray(payload?.data?.craftsmen)) return payload.data.craftsmen;
  return [];
}

function getCurrentLoggedInCraftsmanId() {
  if (typeof window === "undefined") return "";
  try {
    const raw = window.localStorage.getItem("forsaCraftsman");
    if (!raw) return "";
    const parsed = JSON.parse(raw);
    return String(parsed?._id || parsed?.id || "").trim();
  } catch {
    return "";
  }
}
function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function initialsFromName(firstName, lastName) {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.trim() || "ح";
}

function formatPrice(price) {
  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice <= 0)
    return "السعر غير محدد";
  return `${numericPrice} ₪ / ساعة`;
}

function formatExperience(years) {
  const numericYears = Number(years);
  if (!Number.isFinite(numericYears) || numericYears < 0) return "غير محدد";
  return `${numericYears} سنة`;
}

function getRatingValue(craftsman) {
  const numericRating = Number(craftsman?.rating);
  if (Number.isFinite(numericRating) && numericRating > 0) {
    return Math.min(5, numericRating);
  }
  return 4.5;
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const halfOrEmpty = rating % 1 >= 0.5 ? "☆" : "";
  return `${"★".repeat(full)}${halfOrEmpty}`;
}

function buildPages(currentPage, totalPages) {
  const items = [];

  for (let page = 1; page <= totalPages; page += 1) {
    const shouldShow =
      page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;

    if (shouldShow) {
      items.push(page);
    } else {
      const last = items[items.length - 1];
      if (last !== "dots") items.push("dots");
    }
  }

  return items;
}

export default function ProfessionCraftsmen() {
  const navigate = useNavigate();
  const { profession } = useParams();

  const currentLoggedInCraftsmanId = useMemo(
    () => getCurrentLoggedInCraftsmanId(),
    [],
  );

  const [craftsmen, setCraftsmen] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const professionMap = useMemo(
    () => ({
      engineer: "مهندس",
      plumber: "سباك",
      painter: "دهان",
      carpenter: "نجار",
      electrician: "كهربائي",
      technician: "فني",
      driver: "سائق",
      mechanic: "ميكانيكي",
      other: "أخرى",
      مهندس: "مهندس",
      سباك: "سباك",
      دهان: "دهان",
      نجار: "نجار",
      كهربائي: "كهربائي",
      فني: "فني",
      سائق: "سائق",
      ميكانيكي: "ميكانيكي",
      أخرى: "أخرى",
    }),
    [],
  );

  const normalizedProfession = useMemo(() => {
    return professionMap[profession] || profession || "";
  }, [profession, professionMap]);

  const pageTitle = normalizedProfession || "حرفي";

  useEffect(() => {
    const fetchCraftsmen = async () => {
      try {
        setLoading(true);
        setError("");

        let url = `${API_BASE_URL}/api/craftsmen?profession=${encodeURIComponent(normalizedProfession)}`;

        if (selectedCity) {
          url += `&city=${encodeURIComponent(selectedCity)}`;
        }

        const response = await fetch(url);
        const result = await readJsonSafe(response);

        const isSuccess =
          response.ok &&
          (result?.success === true || result?.status?.status === true);

        if (!isSuccess) {
          setError(
            result?.message ||
              result?.status?.message ||
              "حدث خطأ أثناء جلب الحرفيين",
          );
          setCraftsmen([]);
          return;
        }

        setCraftsmen(extractCraftsmen(result));
      } catch (err) {
        setError("تعذر الاتصال بالسيرفر");
        setCraftsmen([]);
      } finally {
        setLoading(false);
      }
    };

    if (normalizedProfession) {
      fetchCraftsmen();
    } else {
      setLoading(false);
      setCraftsmen([]);
      setError("المهنة غير صحيحة");
    }
  }, [normalizedProfession, selectedCity]);

  const visibleCraftsmen = useMemo(() => {
    if (!currentLoggedInCraftsmanId) return craftsmen;
    return craftsmen.filter(
      (item) =>
        String(item._id || item.id || "") !==
        String(currentLoggedInCraftsmanId),
    );
  }, [craftsmen, currentLoggedInCraftsmanId]);

  const cityOptions = useMemo(() => {
    const values = new Set();

    visibleCraftsmen.forEach((craftsman) => {
      const city = String(craftsman.city || "").trim();
      if (city) values.add(city);
    });

    return Array.from(values);
  }, [visibleCraftsmen]);

  const filteredCraftsmen = useMemo(() => {
    const query = normalizeText(searchTerm);

    let result = visibleCraftsmen.filter((craftsman) => {
      if (!query) return true;

      const fullName = `${craftsman.firstName || ""} ${craftsman.lastName || ""}`;
      return normalizeText(fullName).includes(query);
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "experience") {
        return (
          Number(b.yearsOfExperience || 0) - Number(a.yearsOfExperience || 0)
        );
      }

      if (sortBy === "price") {
        const aPrice = Number(a.price || Infinity);
        const bPrice = Number(b.price || Infinity);
        return aPrice - bPrice;
      }

      return getRatingValue(b) - getRatingValue(a);
    });

    return result;
  }, [visibleCraftsmen, searchTerm, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCity, sortBy, normalizedProfession]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCraftsmen.length / ITEMS_PER_PAGE),
  );

  const paginatedCraftsmen = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCraftsmen.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCraftsmen, currentPage]);

  const pages = useMemo(
    () => buildPages(currentPage, totalPages),
    [currentPage, totalPages],
  );

  return (
    <div className="profession-page">
      <div className="profession-page-container">
        <div className="page-header">
          <div className="profession-breadcrumb">
            <span>الرئيسية</span>
            <span>›</span>
            <span>المهن</span>
            <span>›</span>
            <span className="profession-breadcrumb-current">{pageTitle}</span>
          </div>

          <button
            type="button"
            className="back-home-button"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={13} />
          </button>
        </div>

        <div className="profession-hero">
          <div className="profession-hero-text">
            <h1>{pageTitle}ون في غزة</h1>
            <p>احجز حرفياً موثوقاً بالقرب منك</p>
          </div>

          <span className="profession-hero-badge">
            {filteredCraftsmen.length} حرفي متاح
          </span>
        </div>

        <div className="filters-card">
          <div className="filters-row">
            <div className="search-wrap">
              <span className="search-ico">
                <Search size={14} />
              </span>
              <input
                className="search-inp"
                placeholder="ابحث باسم الحرفي..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="region-sel"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">كل المناطق</option>{" "}
              <option value="غزة">غزة</option>
              <option value="شمال غزة">شمال غزة</option>
              <option value="الوسطى">الوسطى</option>
              <option value="الجنوب">الجنوب</option>
              ))
            </select>
          </div>
        </div>

        {loading && <p className="page-state">جاري تحميل الحرفيين...</p>}
        {error && <p className="page-state error-text">{error}</p>}

        {!loading && !error && filteredCraftsmen.length === 0 && (
          <p className="page-state">لا يوجد حرفيون ضمن هذه المهنة حاليًا.</p>
        )}

        {!loading && !error && filteredCraftsmen.length > 0 && (
          <>
            <div className="list">
              {paginatedCraftsmen.map((craftsman) => {
                const id = craftsman._id || craftsman.id;
                const fullName =
                  `${craftsman.firstName || ""} ${craftsman.lastName || ""}`.trim();
                const rating = getRatingValue(craftsman);
                const isAvailable = craftsman.isAvailable !== false;

                return (
                  <div
                    className="c-card"
                    key={id}
                    onClick={() => navigate(`/craftsman/${id}`)}
                  >
                    <div className="c-av">
                      {getCraftsmanImage(craftsman) ? (
                        <img
                          src={getCraftsmanImage(craftsman)}
                          alt={fullName}
                        />
                      ) : (
                        <span>
                          {initialsFromName(
                            craftsman.firstName,
                            craftsman.lastName,
                          )}
                        </span>
                      )}
                    </div>

                    <div className="c-info">
                      <div>
                        <div className="c-name">{fullName}</div>
                        <div className="c-sub">
                          {craftsman.city || "غير محدد"}
                        </div>
                      </div>

                      <div className="c-chips">
                        <span className="chip">
                          <Clock3 size={11} />
                          {formatExperience(craftsman.yearsOfExperience)}
                        </span>

                        <span className="chip">
                          <CircleDollarSign size={11} />
                          {formatPrice(craftsman.price)}
                        </span>
                      </div>
                    </div>

                    <div className="c-right">
                      <button
                        type="button"
                        className="req-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/craftsman/${id}`);
                        }}
                      >
                        اطلب الآن
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  type="button"
                  className="pg-btn"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronRight size={16} />
                </button>

                {pages.map((item, index) =>
                  item === "dots" ? (
                    <span className="pg-dots" key={`dots-${index}`}>
                      …
                    </span>
                  ) : (
                    <button
                      type="button"
                      key={item}
                      className={`pg-btn ${item === currentPage ? "active" : ""}`}
                      onClick={() => setCurrentPage(item)}
                    >
                      {item}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  className="pg-btn"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronLeft size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
