import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "Hair", label: "Hair" },
  { id: "Color & highlights", label: "Color & highlights" },
  { id: "Hands & feet", label: "Hands & feet" },
  { id: "Makeup", label: "Makeup" },
  { id: "Treatments", label: "Treatments" },
];

const GALLERY_IMAGES = Object.values(
  import.meta.glob("../assets/Images/gallery/*.{png,jpg,jpeg,webp}", {
    eager: true,
    as: "url",
  }),
);

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [team, setTeam] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState("");
  const [activeMemberId, setActiveMemberId] = useState(null);
  const memberTimeoutRef = useRef(null);
  const [heroBanners, setHeroBanners] = useState([]);
  const [heroLoading, setHeroLoading] = useState(true);
  const [heroError, setHeroError] = useState("");
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const loadProducts = async () => {
      if (!supabase) {
        setProductsError("Connect Supabase to show products on the homepage.");
        setLoadingProducts(false);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (error) {
        setProductsError(
          error.message ??
            "We couldn't load featured products. Please try again later.",
        );
      } else {
        const list = data ?? [];
        setProducts(list);
        setNewArrivals(list.slice(0, 4));
      }
      setLoadingProducts(false);
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const loadHeroBanners = async () => {
      if (!supabase) {
        setHeroLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("hero_banners")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (error) {
        setHeroError(
          error.message ??
            "We couldn't load the offers banner. The hero will only show the text.",
        );
        setHeroBanners([]);
      } else {
        setHeroBanners(data ?? []);
      }
      setHeroLoading(false);
    };

    loadHeroBanners();
  }, []);

  useEffect(() => {
    const loadTeam = async () => {
      if (!supabase) {
        setTeamError("Connect Supabase to show the team on the homepage.");
        setTeamLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: true })
        .limit(3);

      if (error) {
        setTeamError(
          error.message ?? "We couldn't load the team. Please try again later.",
        );
      } else {
        setTeam(data ?? []);
      }
      setTeamLoading(false);
    };

    loadTeam();
  }, []);

  useEffect(() => {
    if (!products.length) {
      setFeatured([]);
      return;
    }

    const pool =
      selectedCategory === "all"
        ? products
        : products.filter((product) => product.category === selectedCategory);

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setFeatured(shuffled.slice(0, 5));
  }, [products, selectedCategory]);

  useEffect(() => {
    if (!heroBanners.length) {
      setHeroIndex(0);
      return;
    }
    setHeroIndex((current) =>
      Math.min(current, Math.max(heroBanners.length - 1, 0)),
    );
  }, [heroBanners.length]);

  useEffect(() => {
    if (!heroBanners.length) return;

    const timer = setInterval(() => {
      setHeroIndex((current) =>
        heroBanners.length > 0 ? (current + 1) % heroBanners.length : 0,
      );
    }, 6000);

    return () => clearInterval(timer);
  }, [heroBanners.length]);

  const handleHeroClick = (banner) => {
    if (!banner?.link_url) return;
    const link = banner.link_url.trim();
    if (!link) return;

    if (link.startsWith("http")) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      navigate(link);
    }
  };

  const showHeroCarousel = !heroLoading && heroBanners.length > 0;
  const currentBanner =
    showHeroCarousel && heroBanners[heroIndex] ? heroBanners[heroIndex] : null;

  const handleMemberCardClick = (memberId) => {
    setActiveMemberId(memberId);
    if (memberTimeoutRef.current) {
      clearTimeout(memberTimeoutRef.current);
    }
    memberTimeoutRef.current = setTimeout(() => {
      setActiveMemberId(null);
    }, 6000);
  };

  useEffect(
    () => () => {
      if (memberTimeoutRef.current) {
        clearTimeout(memberTimeoutRef.current);
      }
    },
    [],
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <div className="relative grid gap-10 md:grid-cols-[1.1fr,1.1fr] md:items-center">
        <div className="space-y-6">
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Your moment of self-care,
            <span className="text-rose-600"> exactly as you deserve it.</span>
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
            At D&apos;Mayra Salon we combine professional techniques with a warm
            atmosphere so that every visit feels like relaxation, style and
            confidence. Hair, hands and skin in expert hands.
          </p>
          {showHeroCarousel && currentBanner && (
            <section className="mt-4 space-y-2 text-xs text-slate-700 md:text-sm">
              <div className="mt-2 overflow-hidden rounded-2xl">
                <button
                  type="button"
                  onClick={() => handleHeroClick(currentBanner)}
                  className="block w-full"
                >
                  <div className="aspect-[16/6] w-full overflow-hidden">
                    <img
                      src={currentBanner.image_url}
                      alt={currentBanner.title || "Salon offer"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </button>
              </div>
              {(currentBanner.title || currentBanner.link_url) && (
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div>
                    {currentBanner.title && (
                      <p className="text-xs font-semibold text-slate-900 md:text-sm">
                        {currentBanner.title}
                      </p>
                    )}
                  </div>
                  {heroBanners.length > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setHeroIndex((current) =>
                            current === 0
                              ? heroBanners.length - 1
                              : current - 1,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 text-xs font-semibold text-slate-700 hover:border-rose-300 hover:bg-rose-50"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setHeroIndex((current) =>
                            current === heroBanners.length - 1
                              ? 0
                              : current + 1,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 text-xs font-semibold text-slate-700 hover:border-rose-300 hover:bg-rose-50"
                      >
                        ›
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}
          {heroError && !heroLoading && (
            <p className="text-xs text-rose-700">{heroError}</p>
          )}
        </div>
      </div>

      <section className="mt-14 rounded-3xl border border-rose-100 bg-white/80 p-5 shadow-sm shadow-rose-100 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">
              d&apos;mayra store
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              Products that complete your at-home routine.
            </h2>
            <p className="mt-1 max-w-xl text-xs text-slate-600 md:text-sm">
              Discover some of the products we recommend to our clients. Up to 5
              are displayed randomly depending on the category.
            </p>
          </div>
          <Link
            to="/store"
            className="inline-flex items-center rounded-full border border-rose-200 bg-white px-4 py-2 text-xs font-semibold text-rose-700 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 md:text-sm"
          >
            View full store
          </Link>
        </div>

        {!loadingProducts && !productsError && newArrivals.length > 0 && (
          <div className="mt-4 rounded-2xl border border-rose-100 bg-white/90 p-3 text-xs text-slate-700 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-rose-600">
                new arrivals
              </p>
              <span className="text-[11px] text-slate-500">
                Recently added products
              </span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {newArrivals.map((product) => (
                <article
                  key={product.id}
                  className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-white/95 p-3 text-xs text-slate-700 shadow-sm md:flex-col md:items-stretch md:gap-2"
                  onClick={() => navigate(`/product/${product.id}`)}
                  role="button"
                  tabIndex={0}
                >
                  {product.image_url && (
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-rose-50 md:h-32 md:w-full">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 md:w-full">
                    <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
                      {product.name}
                    </h3>
                    {product.category && (
                      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-rose-600">
                        {product.category}
                      </p>
                    )}
                    <p className="mt-2 text-sm font-semibold text-rose-700">
                      {product.price != null
                        ? `$${(product.price / 100).toFixed(2)}`
                        : "Ask us"}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition md:px-4 ${
                  isActive
                    ? "border-rose-600 bg-rose-600 text-white"
                    : "border-rose-100 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50"
                }`}
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-rose-300 text-[10px]">
                  {category.label.charAt(0)}
                </span>
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          {loadingProducts && (
            <p className="text-xs text-slate-600">Loading products...</p>
          )}
          {productsError && !loadingProducts && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {productsError}
            </p>
          )}
          {!loadingProducts && !productsError && featured.length === 0 && (
            <p className="text-xs text-slate-600">
              There are no products to show for this category yet.
            </p>
          )}

          {!loadingProducts && !productsError && featured.length > 0 && (
            <div className="grid gap-4 pt-1 sm:grid-cols-2 lg:grid-cols-5">
              {featured.map((product) => (
                <article
                  key={product.id}
                  className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-white/90 p-3 text-xs text-slate-700 shadow-sm md:flex-col md:items-stretch md:gap-2"
                  onClick={() => navigate(`/product/${product.id}`)}
                  role="button"
                  tabIndex={0}
                >
                  {product.image_url && (
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-rose-50 md:h-32 md:w-full">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 md:w-full">
                    <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
                      {product.name}
                    </h3>
                    {product.category && (
                      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-rose-600">
                        {product.category}
                      </p>
                    )}
                    {product.description && (
                      <p className="mt-1 line-clamp-2 text-[11px] text-slate-500">
                        {product.description}
                      </p>
                    )}
                    <p className="mt-2 text-sm font-semibold text-rose-700">
                      {product.price != null
                        ? `$${(product.price / 100).toFixed(2)}`
                        : "Ask us"}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mt-12 rounded-3xl border border-rose-100 bg-white/80 p-5 text-sm text-slate-700 shadow-sm shadow-rose-100 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">
              our team
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              The people behind your new look.
            </h2>
            <p className="mt-1 max-w-xl text-xs text-slate-600 md:text-sm">
              Get to know some of D&apos;Mayra&apos;s specialists and their
              usual schedules. You can see the full team in the About section.
            </p>
          </div>
          <Link
            to="/about"
            className="inline-flex items-center rounded-full border border-rose-200 bg-white px-4 py-2 text-xs font-semibold text-rose-700 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 md:text-sm"
          >
            View full team
          </Link>
        </div>

        <div className="mt-4">
          {teamLoading && (
            <p className="text-xs text-slate-600">Loading team...</p>
          )}
          {teamError && !teamLoading && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {teamError}
            </p>
          )}
          {!teamLoading && !teamError && team.length === 0 && (
            <p className="text-xs text-slate-600">
              You haven&apos;t added team members yet. You can do it from the
              admin panel.
            </p>
          )}

          {!teamLoading && !teamError && team.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
              {team.map((member) => {
                const currentYear = new Date().getFullYear();
                const startYear = member.specialization_start_year;
                const years =
                  typeof startYear === "number" && startYear > 1900
                    ? currentYear - startYear
                    : null;

                let parsedSchedule = null;
                if (member.schedule) {
                  try {
                    const maybe = JSON.parse(member.schedule);
                    if (Array.isArray(maybe)) {
                      parsedSchedule = maybe;
                    }
                  } catch {
                    parsedSchedule = null;
                  }
                }

                const isActive = activeMemberId === member.id;
                const nameParts = (member.name || "").trim().split(" ");
                const firstName = nameParts[0] || "";
                const lastName =
                  nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

                return (
                  <article
                    key={member.id}
                    className="team-card aspect-[9/16] cursor-pointer text-xs text-slate-700"
                    onClick={() => handleMemberCardClick(member.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div
                      className="relative h-full w-full overflow-hidden rounded-3xl border border-rose-100 shadow-sm transition-transform duration-500"
                      style={{
                        transform: isActive
                          ? "rotateY(10deg) scale(0.98)"
                          : "rotateY(0deg)",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: member.photo_url
                            ? `url(${member.photo_url})`
                            : undefined,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10" />
                        <div className="relative flex h-full flex-col justify-between p-4 text-xs text-slate-50">
                          <div className="text-center">
                            <p className="text-lg font-semibold tracking-tight">
                              {firstName}
                            </p>
                            {lastName && (
                              <p className="mt-0.5 text-[11px] uppercase tracking-[0.25em] text-rose-200">
                                {lastName}
                              </p>
                            )}
                          </div>
                          <div className="space-y-1.5 text-[11px]">
                            {member.role && (
                              <p className="font-semibold text-rose-100">
                                {member.role}
                              </p>
                            )}
                            {member.description && (
                              <p className="line-clamp-3 text-slate-100/90">
                                {member.description}
                              </p>
                            )}
                            {years && (
                              <p>
                                <span className="font-semibold text-rose-100">
                                  Experience:
                                </span>{" "}
                                {years} years
                              </p>
                            )}
                          </div>
                          {member.phone && (
                            <div className="pt-1">
                              <a
                                href={`tel:${member.phone}`}
                                onClick={(event) => event.stopPropagation()}
                                className="inline-flex w-full items-center justify-center rounded-full bg-rose-500/90 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-400"
                              >
                                Call {firstName}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        className={`absolute inset-0 bg-white/95 text-slate-700 transition-opacity duration-300 ${
                          isActive ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                      >
                        <div className="flex h-full flex-col justify-between p-4 text-[11px]">
                          <div>
                            <p className="text-center text-sm font-semibold text-slate-900">
                              {member.name}
                            </p>
                            <p className="mt-0.5 text-center text-[10px] uppercase tracking-[0.25em] text-rose-300">
                              Weekly schedule
                            </p>
                            <div className="mt-3">
                              {parsedSchedule && parsedSchedule.length > 0 ? (
                                <ul className="space-y-1">
                                  {parsedSchedule.map((slot) => (
                                    <li
                                      key={slot.id}
                                      className="flex items-center justify-between gap-2"
                                    >
                                      <span className="font-semibold text-slate-900">
                                        {slot.label}
                                      </span>
                                      <span className="text-slate-600">
                                        {slot.from} – {slot.to}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-center text-slate-500">
                                  No schedule has been added yet.
                                </p>
                              )}
                            </div>
                          </div>
                          <p className="mt-3 text-center text-[10px] text-slate-400">
                            The card will return to the photo after a few
                            seconds without interaction.
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {GALLERY_IMAGES.length > 0 && (
        <section className="mt-14 rounded-3xl border border-rose-100 bg-white/80 p-5 text-sm text-slate-700 shadow-sm shadow-rose-100 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">
                recent work
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                A quick peek at our work.
              </h2>
              <p className="mt-1 max-w-xl text-xs text-slate-600 md:text-sm">
                Hairstyles, color and manicures from real clients at
                D&apos;Mayra. This is just a small sample; you can see more
                details in the gallery.
              </p>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center rounded-full border border-rose-200 bg-white px-4 py-2 text-xs font-semibold text-rose-700 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 md:text-sm"
            >
              View full gallery
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-4">
            {GALLERY_IMAGES.slice(0, 8).map((src, index) => (
              <figure
                key={src}
                className="group relative overflow-hidden rounded-2xl border border-rose-100 bg-rose-50/60 shadow-sm"
              >
                <div className="w-full overflow-hidden portrait-card">
                  <img
                    src={src}
                    alt={`Work done at D'Mayra Salon ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="mt-14 grid gap-6 rounded-3xl border border-rose-100 bg-white/80 p-5 text-sm text-slate-700 shadow-sm shadow-rose-100 md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] md:p-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">
            location
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Visit us at 1022 Broad St
          </h2>
          <p className="text-xs text-slate-600 md:text-sm">
            We are in a central and easy-to-access area so getting to the salon
            is as simple as taking a moment for yourself.
          </p>
          <ul className="space-y-1 text-xs text-slate-600">
            <li>
              <span className="font-semibold text-slate-800">Address:</span>{" "}
              1022 Broad St, Providence,<br></br> RI 02905 United States
            </li>

            <li>
              <span className="font-semibold text-slate-800">Hours:</span>{" "}
              Monday to Saturday · 9:00am to 7:00pm
            </li>
          </ul>
          <div className="flex flex-wrap gap-2 pt-1">
            <Link
              to="/contact"
              className="inline-flex items-center rounded-full border border-rose-200 bg-white px-4 py-2 text-xs font-semibold text-rose-700 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 md:text-sm"
            >
              View more contact details
            </Link>
          </div>
        </div>
        <div className="flex h-52 items-center justify-center rounded-2xl border border-dashed border-rose-200 bg-rose-50/60 p-0 text-center text-xs text-slate-600 md:h-64">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d246.15168371607126!2d-71.41324405005608!3d41.797210589722454!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e44f13d0930519%3A0x60b1bd4233e60c40!2sD&#39;%20Mayra%20Beauty%20Supply!5e0!3m2!1ses-419!2sus!4v1774902449780!5m2!1ses-419!2sus"
            title="D'Mayra Salon location"
            className="h-full w-full rounded-2xl"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </main>
  );
}

export default Home;
