import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [team, setTeam] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      if (!supabase) {
        setProductsError(
          "Connect Supabase to show products on the homepage.",
        );
        setLoadingProducts(false);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true);

      if (error) {
        setProductsError(
          error.message ??
            "We couldn't load featured products. Please try again later.",
        );
      } else {
        setProducts(data ?? []);
      }
      setLoadingProducts(false);
    };

    loadProducts();
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
          error.message ??
            "We couldn't load the team. Please try again later.",
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
          <div className="flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
            >
              Book appointment
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center rounded-full border border-rose-200 bg-white px-6 py-2.5 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50"
            >
              View services
            </Link>
          </div>

          <dl className="mt-4 grid max-w-md grid-cols-3 gap-4 text-xs text-slate-600 md:text-sm">
            <div>
              <dt className="font-semibold text-slate-900">10+ years</dt>
              <dd>of beauty and care experience.</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Pro products</dt>
              <dd>professional brands and tailored treatments.</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Unique vibe</dt>
              <dd>relaxing, feminine and welcoming.</dd>
            </div>
          </dl>
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
              Discover some of the products we recommend to our clients. Up to
              5 are displayed randomly depending on the category.
            </p>
          </div>
          <Link
            to="/store"
            className="inline-flex items-center rounded-full border border-rose-200 bg-white px-4 py-2 text-xs font-semibold text-rose-700 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 md:text-sm"
          >
            View full store
          </Link>
        </div>

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
                  className="flex flex-col rounded-2xl border border-rose-100 bg-white/90 p-3 text-xs text-slate-700 shadow-sm"
                >
                  {product.image_url && (
                    <div className="mb-2 h-20 overflow-hidden rounded-xl bg-rose-50">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
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
                      : "Consultar"}
                  </p>
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
            <div className="mt-3 grid gap-4 md:grid-cols-3">
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

                const schedulePreview = parsedSchedule
                  ? parsedSchedule.slice(0, 2)
                  : null;

                return (
                  <article
                    key={member.id}
                    className="flex flex-col rounded-2xl border border-rose-100 bg-white/90 p-4 text-xs text-slate-700 shadow-sm"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      {member.photo_url && (
                        <div className="h-12 w-12 overflow-hidden rounded-full bg-rose-50">
                          <img
                            src={member.photo_url}
                            alt={member.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {member.name}
                        </p>
                        {member.role && (
                          <p className="text-[11px] uppercase tracking-[0.25em] text-rose-600">
                            {member.role}
                          </p>
                        )}
                      </div>
                    </div>
                    {member.description && (
                      <p className="text-[11px] text-slate-600">
                        {member.description}
                      </p>
                    )}
                    <div className="mt-3 space-y-1 text-[11px] text-slate-600">
                      {years && (
                        <p>
                          <span className="font-semibold text-slate-800">
                            Experience:
                          </span>{" "}
                          {years} years
                        </p>
                      )}
                      {schedulePreview && (
                        <div>
                          <p>
                            <span className="font-semibold text-slate-800">
                            Hours:
                            </span>
                          </p>
                          <ul className="mt-1 space-y-0.5">
                            {schedulePreview.map((slot) => (
                              <li key={slot.id}>
                                {slot.label}: {slot.from} – {slot.to}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {member.phone && (
                        <p>
                          <span className="font-semibold text-slate-800">
                            Phone:
                          </span>{" "}
                          {member.phone}
                        </p>
                      )}
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
              <span className="font-semibold text-slate-800">Address:</span>{' '}
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
