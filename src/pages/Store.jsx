import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const PAGE_SIZE = 10;

const normalizeQuery = (raw) => {
  let q = raw.toLowerCase();
  q = q.replace(/shampu/g, "shampoo");
  q = q.replace(/acondicionador|condicionador/g, "conditioner");
  q = q.replace(/peine/g, "comb");
  return q;
};

function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();
  const { items: cart, addItem, removeItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      if (!supabase) {
        setError(
          "Supabase is not configured. Add your credentials to load products.",
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      let query = supabase.from("products").select("*").eq("active", true);

      const trimmed = searchTerm.trim();
      if (trimmed) {
        const normalized = normalizeQuery(trimmed);
        const pattern = `%${normalized}%`;
        query = query.or(
          `name.ilike.${pattern},category.ilike.${pattern},description.ilike.${pattern}`,
        );
      }

      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error: dbError } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

      if (dbError) {
        setError(dbError.message ?? "We could not load products.");
        setProducts([]);
        setHasMore(false);
      } else {
        const list = data ?? [];
        setProducts(list);
        setHasMore(list.length === PAGE_SIZE);
      }

      setLoading(false);
    };

    loadProducts();
  }, [searchTerm, page]);

  useEffect(() => {
    const q = searchQuery.trim();

    if (!supabase || q.length < 2) {
      setSuggestions([]);
      setSuggestionsLoading(false);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      setSuggestionsLoading(true);
      const normalized = normalizeQuery(q);
      const pattern = `%${normalized}%`;

      const { data, error: dbError } = await supabase
        .from("products")
        .select("id,name,category")
        .eq("active", true)
        .or(
          `name.ilike.${pattern},category.ilike.${pattern},description.ilike.${pattern}`,
        )
        .order("created_at", { ascending: false })
        .limit(8);

      if (!cancelled) {
        if (dbError) {
          setSuggestions([]);
        } else {
          setSuggestions(data ?? []);
        }
        setSuggestionsLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const total = cart.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.quantity,
    0,
  );

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchTerm(searchQuery);
    setPage(0);
  };

  const handleSuggestionClick = (term) => {
    setSearchQuery(term);
    setSearchTerm(term);
    setPage(0);
    setSuggestions([]);
  };

  const goToCheckout = () => {
    if (cart.length === 0) return;
    navigate("/checkout", { state: { cart } });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <form onSubmit={handleSearchSubmit} className="mb-6 flex justify-center">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search products (e.g. shampoo, conditioner, comb)"
            className="w-full rounded-full border border-rose-100 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSearchTerm("");
                setPage(0);
                setSuggestions([]);
              }}
              className="absolute inset-y-0 right-3 my-auto text-[11px] font-semibold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
          {suggestionsLoading && (
            <p className="absolute left-4 top-full mt-1 text-[11px] text-slate-500">
              Searching...
            </p>
          )}
          {!suggestionsLoading && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 z-10 mt-2 max-h-56 overflow-y-auto rounded-2xl border border-rose-100 bg-white text-xs text-slate-700 shadow-lg">
              {suggestions.map((item) => (
                <li
                  key={item.id}
                  className="border-b border-rose-50 last:border-0"
                >
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(item.name)}
                    className="flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-rose-50"
                  >
                    <span>{item.name}</span>
                    {item.category && (
                      <span className="text-[10px] uppercase tracking-[0.2em] text-rose-500">
                        {item.category}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">
            store
          </p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Products to keep your routine at home.
          </h2>
          <p className="mt-2 max-w-xl text-sm text-slate-600 md:text-base">
            Shampoos, treatments, oils and more, selected by our team to match
            your salon services.
          </p>
        </div>
        <div className="text-xs text-slate-600">
          {user ? (
            <p>
              Signed in as <span className="font-semibold">{user.email}</span>
            </p>
          ) : (
            <p>
              <Link
                to="/login"
                className="font-semibold text-rose-700 underline-offset-4 hover:underline"
              >
                Sign in
              </Link>{" "}
              to save your order history.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[minmax(0,2fr),minmax(260px,1fr)]">
        <section className="space-y-4">
          {loading && (
            <p className="text-sm text-slate-600">Loading products...</p>
          )}
          {error && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {error}
            </p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="text-sm text-slate-600">
              {searchTerm
                ? 'We could not find products for this search. Try another keyword like "shampoo", "conditioner" or "comb".'
                : "There are no products in the store yet."}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="flex cursor-pointer flex-col rounded-2xl border border-rose-100 bg-white/80 p-4 text-sm text-slate-700 shadow-sm"
                onClick={() => navigate(`/product/${product.id}`)}
                role="button"
                tabIndex={0}
              >
                {product.image_url && (
                  <div className="mb-3 h-40 overflow-hidden rounded-2xl bg-rose-50">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <h3 className="text-base font-semibold text-slate-900">
                  {product.name}
                </h3>
                {product.category && (
                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-rose-600">
                    {product.category}
                  </p>
                )}
                {product.description && (
                  <p className="mt-2 text-xs text-slate-600">
                    {product.description}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between text-sm">
                  <p className="font-semibold text-rose-700">
                    {product.price != null
                      ? `$${(product.price / 100).toFixed(2)}`
                      : "Ask us"}
                  </p>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      addItem(product, 1);
                    }}
                    className="rounded-full bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700"
                  >
                    Add to cart
                  </button>
                </div>
              </article>
            ))}
          </div>
          {!loading && !error && products.length > 0 && (
            <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
              <span>Page {page + 1}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page === 0}
                  onClick={() => setPage((current) => Math.max(0, current - 1))}
                  className="rounded-full border border-rose-100 px-3 py-1 font-semibold disabled:opacity-40 hover:border-rose-300 hover:bg-rose-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={!hasMore}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-full border border-rose-100 px-3 py-1 font-semibold disabled:opacity-40 hover:border-rose-300 hover:bg-rose-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-4 text-sm text-slate-700 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Your cart</h3>
          {cart.length === 0 ? (
            <p className="text-xs text-slate-600">
              You haven&apos;t added products yet. Choose one from the list.
            </p>
          ) : (
            <ul className="space-y-2 text-xs">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-2"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {item.name}{" "}
                      <span className="font-normal text-slate-500">
                        x{item.quantity}
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      ${(item.price / 100).toFixed(2)} each
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-[11px] font-semibold text-rose-600 underline-offset-4 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-rose-100 pt-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Total</span>
              <span className="text-sm font-semibold text-rose-700">
                ${total.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Payments are processed securely with Square.
            </p>
          </div>
          <button
            type="button"
            disabled={cart.length === 0}
            onClick={goToCheckout}
            className="inline-flex w-full items-center justify-center rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-60"
          >
            Continue to checkout
          </button>
        </aside>
      </div>
    </main>
  );
}

export default Store;
