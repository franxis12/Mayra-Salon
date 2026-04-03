import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { useAuth } from '../context/AuthContext.jsx'

const WEEK_DAYS = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
]

const PRODUCT_CATEGORIES = [
  'Hair',
  'Color & highlights',
  'Hands & feet',
  'Makeup',
  'Treatments',
]

function Dashboard() {
  const { isAdmin, loading: authLoading } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [team, setTeam] = useState([])
  const [teamLoading, setTeamLoading] = useState(true)
  const [teamError, setTeamError] = useState('')
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    costPrice: '',
    category: '',
    imageUrl: '',
    stock: '',
    sku: '',
    locationZone: '',
    locationLevel: '',
    active: true,
  })
  const [imageFile, setImageFile] = useState(null)
  const [savingProduct, setSavingProduct] = useState(false)
  const [editingProductId, setEditingProductId] = useState(null)
  const [editForm, setEditForm] = useState({
    price: '',
    costPrice: '',
  })
  const [locationRows, setLocationRows] = useState([])
  const [locationsLoading, setLocationsLoading] = useState(false)
  const [locationsError, setLocationsError] = useState('')
  const [showProductForm, setShowProductForm] = useState(false)
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [activeTab, setActiveTab] = useState('products')
  const [productSearch, setProductSearch] = useState('')
  const [heroBanners, setHeroBanners] = useState([])
  const [heroLoading, setHeroLoading] = useState(true)
  const [heroError, setHeroError] = useState('')
  const [heroForm, setHeroForm] = useState({
    title: '',
    linkUrl: '',
    imageUrl: '',
    active: true,
  })
  const [heroImageFile, setHeroImageFile] = useState(null)
  const [savingHero, setSavingHero] = useState(false)

  const [teamForm, setTeamForm] = useState({
    name: '',
    role: '',
    photoUrl: '',
    phone: '',
    scheduleSlots: WEEK_DAYS.map((day) => ({
      id: day.id,
      label: day.label,
      from: '',
      to: '',
      enabled: false,
    })),
    description: '',
    specializationStartYear: '',
    active: true,
  })

  const loadProducts = async () => {
    if (!supabase) {
      setError(
        'Supabase is not configured. Add your credentials to manage products.',
      )
      setLoading(false)
      return
    }

    const { data, error: dbError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (dbError) {
      setError(dbError.message ?? 'We could not load products.')
    } else {
      setProducts(data ?? [])
    }
    setLoading(false)
  }

  const loadTeam = async () => {
    if (!supabase) {
      setTeamError(
        'Supabase is not configured. Add your credentials to manage the team.',
      )
      setTeamLoading(false)
      return
    }

    const { data, error: dbError } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: true })

    if (dbError) {
      setTeamError(dbError.message ?? 'We could not load the team.')
    } else {
      setTeam(data ?? [])
    }
    setTeamLoading(false)
  }

  const loadHeroBanners = async () => {
    if (!supabase) {
      setHeroError(
        'Supabase is not configured. Add your credentials to manage hero banners.',
      )
      setHeroLoading(false)
      return
    }

    const { data, error: dbError } = await supabase
      .from('hero_banners')
      .select('*')
      .order('created_at', { ascending: false })

    if (dbError) {
      setHeroError(dbError.message ?? 'We could not load hero banners.')
      setHeroBanners([])
    } else {
      setHeroBanners(data ?? [])
    }
    setHeroLoading(false)
  }

  useEffect(() => {
    if (authLoading) return
    if (!isAdmin) return
    loadProducts()
    loadTeam()
    loadHeroBanners()
  }, [authLoading, isAdmin])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleImageFileChange = (event) => {
    const file = event.target.files?.[0] ?? null
    setImageFile(file)
  }

  const handleHeroImageFileChange = (event) => {
    const file = event.target.files?.[0] ?? null
    setHeroImageFile(file)
  }

  const handleEditChange = (event) => {
    const { name, value } = event.target
    setEditForm((current) => ({ ...current, [name]: value }))
  }

  const handleTeamChange = (event) => {
    const { name, value, type, checked } = event.target
    setTeamForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleHeroChange = (event) => {
    const { name, value, type, checked } = event.target
    setHeroForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const updateScheduleSlot = (dayId, partial) => {
    setTeamForm((current) => {
      const slots = current.scheduleSlots || []
      const nextSlots = slots.map((slot) =>
        slot.id === dayId ? { ...slot, ...partial } : slot,
      )
      return { ...current, scheduleSlots: nextSlots }
    })
  }

  const addLocationRow = () => {
    setLocationRows((rows) => [
      ...rows,
      { id: null, zone: '', level: '', quantity: '' },
    ])
  }

  const updateLocationRow = (index, partial) => {
    setLocationRows((rows) =>
      rows.map((row, i) => (i === index ? { ...row, ...partial } : row)),
    )
  }

  const removeLocationRow = (index) => {
    setLocationRows((rows) => rows.filter((_, i) => i !== index))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (savingProduct) return
    setError('')

    if (!supabase) {
      setError('Supabase is not configured.')
      return
    }

    setSavingProduct(true)

    try {
      const priceInCents = Math.round(Number(form.price || 0) * 100)
      const costInCents =
        form.costPrice !== '' && !Number.isNaN(Number(form.costPrice))
          ? Math.round(Number(form.costPrice) * 100)
          : null
      const stockNumber =
        form.stock !== '' && !Number.isNaN(Number(form.stock))
          ? Number(form.stock)
          : null

      let imageUrlToSave = form.imageUrl || null

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${crypto.randomUUID?.() || Date.now()}.${
          fileExt || 'jpg'
        }`
        const filePath = `products/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          setError(
            uploadError.message ??
              'We could not upload the image. Please try again.',
          )
          return
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from('product-images').getPublicUrl(filePath)
        imageUrlToSave = publicUrl
      }

      const locationCode =
        form.locationZone && form.locationLevel
          ? `${form.locationZone}.${form.locationLevel}`
          : null

      const { data: inserted, error: insertError } = await supabase
        .from('products')
        .insert({
          name: form.name,
          description: form.description,
          category: form.category || null,
          image_url: imageUrlToSave,
          price: priceInCents,
          cost_price: costInCents,
          stock: stockNumber,
          sku: form.sku || null,
          location: locationCode,
          active: form.active,
        })
        .select('id')
        .single()

      if (insertError || !inserted) {
        setError(
          insertError?.message ?? 'We could not create the product.',
        )
        return
      }

      if (stockNumber != null && locationCode) {
        await supabase.from('product_locations').insert({
          product_id: inserted.id,
          zone: form.locationZone || null,
          level: form.locationLevel || null,
          quantity: stockNumber,
        })
      }

      setForm({
        name: '',
        description: '',
        price: '',
        costPrice: '',
        category: '',
        imageUrl: '',
        stock: '',
        sku: '',
        locationZone: '',
        locationLevel: '',
        active: true,
      })
      setImageFile(null)

      loadProducts()
    } finally {
      setSavingProduct(false)
    }
  }

  const handleTeamSubmit = async (event) => {
    event.preventDefault()
    setTeamError('')

    if (!supabase) {
      setTeamError('Supabase is not configured.')
      return
    }

    const specializationYear = teamForm.specializationStartYear
      ? Number(teamForm.specializationStartYear)
      : null

    const activeSlots =
      teamForm.scheduleSlots?.filter(
        (slot) => slot.enabled && slot.from && slot.to,
      ) ?? []

    const schedulePayload = activeSlots.length
      ? JSON.stringify(
          activeSlots.map(({ id, label, from, to }) => ({
            id,
            label,
            from,
            to,
          })),
        )
      : null

    const { error: insertError } = await supabase.from('team_members').insert({
      name: teamForm.name,
      role: teamForm.role || null,
      photo_url: teamForm.photoUrl || null,
      phone: teamForm.phone || null,
      schedule: schedulePayload,
      description: teamForm.description || null,
      specialization_start_year: specializationYear,
      active: teamForm.active,
    })

    if (insertError) {
      setTeamError(
        insertError.message ?? 'We could not create the team member.',
      )
      return
    }

    setTeamForm({
      name: '',
      role: '',
      photoUrl: '',
      phone: '',
      scheduleSlots: WEEK_DAYS.map((day) => ({
        id: day.id,
        label: day.label,
        from: '',
        to: '',
        enabled: false,
      })),
      description: '',
      specializationStartYear: '',
      active: true,
    })

    setTeamLoading(true)
    loadTeam()
  }

  const handleHeroSubmit = async (event) => {
    event.preventDefault()
    setHeroError('')

    if (savingHero) return

    if (!supabase) {
      setHeroError('Supabase is not configured.')
      return
    }

    if (!heroImageFile && !heroForm.imageUrl) {
      setHeroError(
        'Please select an image file or provide an image URL.',
      )
      return
    }

    setSavingHero(true)

    try {
      let imageUrlToSave = heroForm.imageUrl || null

      if (heroImageFile) {
        const fileExt = heroImageFile.name.split('.').pop()
        const fileName = `${crypto.randomUUID?.() || Date.now()}.${
          fileExt || 'jpg'
        }`
        const filePath = `hero/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('hero-banners')
          .upload(filePath, heroImageFile, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          setHeroError(
            uploadError.message ??
              'We could not upload the hero image. Please try again.',
          )
          return
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from('hero-banners').getPublicUrl(filePath)

        imageUrlToSave = publicUrl
      }

      const { error: insertError } = await supabase
        .from('hero_banners')
        .insert({
          title: heroForm.title || null,
          link_url: heroForm.linkUrl || null,
          image_url: imageUrlToSave,
          active: heroForm.active,
        })

      if (insertError) {
        setHeroError(
          insertError.message ?? 'We could not save the hero banner.',
        )
        return
      }

      setHeroForm({
        title: '',
        linkUrl: '',
        imageUrl: '',
        active: true,
      })
      setHeroImageFile(null)
      setHeroLoading(true)
      await loadHeroBanners()
    } finally {
      setSavingHero(false)
    }
  }

  const toggleActive = async (product) => {
    if (!supabase) return
    const { error: updateError } = await supabase
      .from('products')
      .update({ active: !product.active })
      .eq('id', product.id)

    if (!updateError) {
      loadProducts()
    }
  }

  const startEditingProduct = async (product) => {
    const currentPrice =
      typeof product.price === 'number'
        ? (product.price / 100).toFixed(2)
        : ''
    const currentCost =
      typeof product.cost_price === 'number'
        ? (product.cost_price / 100).toFixed(2)
        : ''
    setEditingProductId(product.id)
    setEditForm({
      price: currentPrice,
      costPrice: currentCost,
    })

    if (!supabase) return

    setLocationsLoading(true)
    setLocationsError('')

    const { data, error: locationsErrorResponse } = await supabase
      .from('product_locations')
      .select('*')
      .eq('product_id', product.id)
      .order('zone', { ascending: true })

    if (locationsErrorResponse) {
      setLocationsError(
        locationsErrorResponse.message ??
          'We could not load product locations.',
      )
      setLocationRows([])
    } else if (data && data.length > 0) {
      setLocationRows(
        data.map((row) => ({
          id: row.id,
          zone: row.zone ?? '',
          level: row.level ?? '',
          quantity:
            row.quantity != null && !Number.isNaN(row.quantity)
              ? String(row.quantity)
              : '',
        })),
      )
    } else {
      setLocationRows([
        { id: null, zone: '', level: '', quantity: '' },
      ])
    }

    setLocationsLoading(false)
  }

  const cancelEditingProduct = () => {
    setEditingProductId(null)
    setEditForm({
      price: '',
      costPrice: '',
    })
    setLocationRows([])
    setLocationsError('')
    setLocationsLoading(false)
  }

  const saveEditedProduct = async (productId) => {
    if (!supabase) return

    const priceInCents =
      editForm.price !== '' && !Number.isNaN(Number(editForm.price))
        ? Math.round(Number(editForm.price) * 100)
        : null
    const costInCents =
      editForm.costPrice !== '' && !Number.isNaN(Number(editForm.costPrice))
        ? Math.round(Number(editForm.costPrice) * 100)
        : null

    const validRows =
      locationRows
        ?.map((row) => ({
          zone: row.zone,
          level: row.level,
          quantity:
            row.quantity !== '' && !Number.isNaN(Number(row.quantity))
              ? Number(row.quantity)
              : 0,
        }))
        .filter(
          (row) =>
            row.zone &&
            row.level &&
            row.quantity != null &&
            !Number.isNaN(row.quantity),
        ) ?? []

    const totalQuantity = validRows.reduce(
      (sum, row) => sum + row.quantity,
      0,
    )

    const primaryLocation =
      validRows.length > 0
        ? `${validRows[0].zone}.${validRows[0].level}`
        : null

    const { error: deleteError } = await supabase
      .from('product_locations')
      .delete()
      .eq('product_id', productId)

    if (deleteError) {
      setError(
        deleteError.message ??
          'We could not update product locations (delete step).',
      )
      return
    }

    if (validRows.length > 0) {
      const { error: insertError } = await supabase
        .from('product_locations')
        .insert(
          validRows.map((row) => ({
            product_id: productId,
            zone: row.zone,
            level: row.level,
            quantity: row.quantity,
          })),
        )

      if (insertError) {
        setError(
          insertError.message ??
            'We could not update product locations (insert step).',
        )
        return
      }
    }

    const { error: updateError } = await supabase
      .from('products')
      .update({
        price: priceInCents,
        cost_price: costInCents,
        stock: totalQuantity,
        location: primaryLocation,
      })
      .eq('id', productId)

    if (updateError) {
      setError(updateError.message ?? 'We could not update the product.')
      return
    }

    cancelEditingProduct()
    loadProducts()
  }

  const toggleTeamActive = async (member) => {
    if (!supabase) return
    const { error: updateError } = await supabase
      .from('team_members')
      .update({ active: !member.active })
      .eq('id', member.id)

    if (!updateError) {
      loadTeam()
    }
  }

  const toggleHeroBannerActive = async (banner) => {
    if (!supabase) return
    const { error: updateError } = await supabase
      .from('hero_banners')
      .update({ active: !banner.active })
      .eq('id', banner.id)

    if (!updateError) {
      loadHeroBanners()
    }
  }

  const deleteHeroBanner = async (banner) => {
    if (!supabase) return
    const { error: deleteError } = await supabase
      .from('hero_banners')
      .delete()
      .eq('id', banner.id)

    if (!deleteError) {
      loadHeroBanners()
    }
  }

  if (authLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <p className="text-sm text-slate-600">Checking access...</p>
      </main>
    )
  }

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <p className="text-sm text-slate-700">
          This section is only for the salon owner. Make sure you sign in with
          the email configured as administrator.
        </p>
      </main>
    )
  }

  const normalizedSearch = productSearch.trim().toLowerCase()
  const filteredProducts = normalizedSearch
    ? products.filter((product) => {
        const name = (product.name ?? '').toLowerCase()
        const sku = (product.sku ?? '').toLowerCase()
        const category = (product.category ?? '').toLowerCase()
        return (
          name.includes(normalizedSearch) ||
          sku.includes(normalizedSearch) ||
          category.includes(normalizedSearch)
        )
      })
    : products

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
        Admin panel
      </h1>
      <p className="mt-2 text-sm text-slate-600 md:text-base">
        Manage store products, the salon team and homepage offers.
      </p>

      <div className="mt-6 inline-flex rounded-full bg-rose-50 p-1 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`rounded-full px-4 py-1.5 font-semibold transition ${
            activeTab === 'products'
              ? 'bg-white text-rose-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Products
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('team')}
          className={`rounded-full px-4 py-1.5 font-semibold transition ${
            activeTab === 'team'
              ? 'bg-white text-rose-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Team
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`rounded-full px-4 py-1.5 font-semibold transition ${
            activeTab === 'hero'
              ? 'bg-white text-rose-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Hero carousel
        </button>
      </div>

      {showProductForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <section className="w-full max-w-lg space-y-4 rounded-2xl border border-rose-100 bg-white/95 p-4 text-sm text-slate-700 shadow-lg">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-slate-900">
                Add new product
              </h2>
              <button
                type="button"
                onClick={() => setShowProductForm(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="name" className="font-medium text-slate-800">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                placeholder="Ex: Hydrating treatment"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="description"
                className="font-medium text-slate-800"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                className="w-full resize-none rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                placeholder="Short description of the product."
              />
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="price"
                  className="font-medium text-slate-800"
                >
                  Price (USD)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                  placeholder="Ex: 25.50"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="costPrice"
                  className="font-medium text-slate-800"
                >
                  Cost (USD, admin only)
                </label>
                <input
                  id="costPrice"
                  name="costPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.costPrice}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                  placeholder="Ex: 12.00"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="stock" className="font-medium text-slate-800">
                  Available quantity
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                  placeholder="Ex: 10"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="category"
                  className="font-medium text-slate-800"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 focus:ring"
                >
                  <option value="">Select a category</option>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-1.5">
                <label htmlFor="sku" className="font-medium text-slate-800">
                  Barcode / SKU
                </label>
                <input
                  id="sku"
                  name="sku"
                  type="text"
                  value={form.sku}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                  placeholder="Optional, for inventory"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-medium text-slate-800">
                  Location (internal)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    id="locationZone"
                    name="locationZone"
                    value={form.locationZone}
                    onChange={handleChange}
                    className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 focus:ring"
                  >
                    <option value="">Area</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                  <select
                    id="locationLevel"
                    name="locationLevel"
                    value={form.locationLevel}
                    onChange={handleChange}
                    className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 focus:ring"
                  >
                    <option value="">Level</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <p className="text-[11px] text-slate-500">
                  Example: A.2 means area A, level 2.
                </p>
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="imageFile"
                  className="font-medium text-slate-800"
                >
                  Imagen del producto
                </label>
                <input
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="block w-full text-xs text-slate-700 file:mr-2 file:rounded-full file:border file:border-rose-200 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-rose-700 hover:file:border-rose-300 hover:file:bg-rose-50"
                />
                <p className="text-[11px] text-slate-500">
                  The file will be uploaded to Supabase Storage (bucket{' '}
                  <code>product-images</code>).
                </p>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  id="active"
                  name="active"
                  type="checkbox"
                  checked={form.active}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-rose-200 text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="active" className="text-xs text-slate-800">
                  Active product (visible in the store)
                </label>
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={savingProduct}
              className="inline-flex w-full items-center justify-center rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
            >
              {savingProduct ? 'Saving product...' : 'Save product'}
            </button>
          </form>
          </section>
        </div>
      )}

      {activeTab === 'products' && (
      <div className="mt-8 space-y-6">

        <section className="space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-4 text-sm text-slate-700 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900">
              Loaded products
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={productSearch}
                onChange={(event) => setProductSearch(event.target.value)}
                placeholder="Search by name, SKU or category"
                className="w-48 rounded-full border border-rose-100 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
              />
              <button
                type="button"
                onClick={() => setShowProductForm(true)}
                className="inline-flex items-center rounded-full bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700"
              >
                Add product
              </button>
            </div>
          </div>
          {loading && (
            <p className="text-xs text-slate-600">Loading products...</p>
          )}
          {!loading && products.length === 0 && (
            <p className="text-xs text-slate-600">
              There are no products in the database yet.
            </p>
          )}
          <ul className="space-y-2 text-xs">
            {filteredProducts.map((product) => {
              const isEditing = editingProductId === product.id

              return (
                <li
                  key={product.id}
                  className="space-y-2 rounded-xl border border-rose-100 bg-white px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {product.image_url && (
                        <div className="h-14 w-14 overflow-hidden rounded-xl bg-rose-50">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">
                          {product.name}
                          {product.category ? (
                            <span className="ml-2 text-[10px] uppercase tracking-[0.2em] text-rose-600">
                              {product.category}
                            </span>
                          ) : null}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          ${((product.price ?? 0) / 100).toFixed(2)} ·{' '}
                          {product.active ? 'Visible in store' : 'Hidden'}
                        </p>
                        {typeof product.cost_price === 'number' && (
                          <p className="text-[11px] text-slate-500">
                            Cost:{' '}
                            <span className="font-semibold">
                              ${((product.cost_price ?? 0) / 100).toFixed(2)}
                            </span>{' '}
                            · Profit per unit:{' '}
                            {(() => {
                              const profit =
                                (product.price ?? 0) - (product.cost_price ?? 0)
                              const profitClass =
                                profit <= 0
                                  ? 'font-semibold text-rose-600'
                                  : 'font-semibold text-emerald-600'
                              return (
                                <span className={profitClass}>
                                  ${(profit / 100).toFixed(2)}
                                </span>
                              )
                            })()}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-500">
                          {product.stock != null &&
                            !Number.isNaN(product.stock) && (
                              <>
                                Stock:{' '}
                                <span className="font-semibold">
                                  {product.stock}
                                </span>
                              </>
                            )}
                          {product.stock != null &&
                          (product.sku || product.location)
                            ? ' · '
                            : null}
                          {product.sku && <span>SKU: {product.sku}</span>}
                          {product.sku && product.location ? ' · ' : null}
                          {product.location && (
                            <span>Location: {product.location}</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <button
                        type="button"
                        onClick={() => toggleActive(product)}
                        className="text-[11px] font-semibold text-rose-600 underline-offset-4 hover:underline"
                      >
                        {product.active ? 'Hide' : 'Show'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          isEditing
                            ? cancelEditingProduct()
                            : startEditingProduct(product)
                        }
                        className="text-[11px] font-semibold text-slate-700 underline-offset-4 hover:underline"
                      >
                        {isEditing ? 'Cancel edit' : 'Edit details'}
                      </button>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-2 space-y-2 rounded-xl border border-rose-100 bg-white px-3 py-2 text-[11px]">
                      <div className="grid gap-2 md:grid-cols-4">
                        <div className="space-y-1">
                          <label
                            htmlFor={`edit-price-${product.id}`}
                            className="font-medium text-slate-800"
                          >
                            Price (USD)
                          </label>
                          <input
                            id={`edit-price-${product.id}`}
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={editForm.price}
                            onChange={handleEditChange}
                            className="w-full rounded-lg border border-rose-100 bg-white px-2 py-1.5 text-[11px] text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                            placeholder="Ex: 25.50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label
                            htmlFor={`edit-cost-${product.id}`}
                            className="font-medium text-slate-800"
                          >
                            Cost (USD)
                          </label>
                          <input
                            id={`edit-cost-${product.id}`}
                            name="costPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            value={editForm.costPrice}
                            onChange={handleEditChange}
                            className="w-full rounded-lg border border-rose-100 bg-white px-2 py-1.5 text-[11px] text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                            placeholder="Ex: 12.00"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-slate-800">
                            Total quantity
                          </p>
                          <p className="rounded-lg border border-rose-100 bg-slate-50 px-2 py-1.5 text-[11px] text-slate-700">
                            {locationRows
                              .map((row) => Number(row.quantity))
                              .filter((q) => !Number.isNaN(q))
                              .reduce((sum, q) => sum + q, 0)}{' '}
                            units
                          </p>
                        </div>
                        <div className="space-y-1 text-slate-500">
                          <p className="font-medium text-slate-800">
                            Locations
                          </p>
                          <p>
                            Define how much stock you have in each area and
                            level. The total is updated automatically.
                          </p>
                        </div>
                      </div>

                      {locationsError && (
                        <p className="rounded-xl bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
                          {locationsError}
                        </p>
                      )}

                      {locationsLoading ? (
                        <p className="text-[11px] text-slate-600">
                          Loading locations...
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {locationRows.map((row, index) => (
                            <div
                              key={row.id ?? index}
                              className="grid grid-cols-[minmax(0,0.7fr),minmax(0,0.7fr),minmax(0,1fr),auto] items-center gap-2"
                            >
                              <select
                                value={row.zone}
                                onChange={(event) =>
                                  updateLocationRow(index, {
                                    zone: event.target.value,
                                  })
                                }
                                className="rounded-lg border border-rose-100 bg-white px-2 py-1.5 text-[11px] text-slate-900 outline-none ring-rose-200 focus:ring"
                              >
                                <option value="">Area</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                              </select>
                              <select
                                value={row.level}
                                onChange={(event) =>
                                  updateLocationRow(index, {
                                    level: event.target.value,
                                  })
                                }
                                className="rounded-lg border border-rose-100 bg-white px-2 py-1.5 text-[11px] text-slate-900 outline-none ring-rose-200 focus:ring"
                              >
                                <option value="">Level</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                              </select>
                              <input
                                type="number"
                                min="0"
                                step="1"
                                value={row.quantity}
                                onChange={(event) =>
                                  updateLocationRow(index, {
                                    quantity: event.target.value,
                                  })
                                }
                                className="w-full rounded-lg border border-rose-100 bg-white px-2 py-1.5 text-[11px] text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                                placeholder="Quantity"
                              />
                              <button
                                type="button"
                                onClick={() => removeLocationRow(index)}
                                className="text-[11px] font-semibold text-rose-600 underline-offset-4 hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addLocationRow}
                            className="inline-flex items-center justify-center rounded-full border border-rose-200 px-3 py-1.5 text-[11px] font-semibold text-rose-700 shadow-sm hover:border-rose-300 hover:bg-rose-50"
                          >
                            Add location
                          </button>
                          <button
                            type="button"
                            onClick={() => saveEditedProduct(product.id)}
                            className="inline-flex items-center justify-center rounded-full bg-rose-600 px-4 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-rose-700"
                          >
                            Save changes
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      </div>
      )}

      {showTeamForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <section className="w-full max-w-lg space-y-4 rounded-2xl border border-rose-100 bg-white/95 p-4 text-sm text-slate-700 shadow-lg">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-slate-900">
                Add team member
              </h2>
              <button
                type="button"
                onClick={() => setShowTeamForm(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>
          <form onSubmit={handleTeamSubmit} className="space-y-3 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="team-name" className="font-medium text-slate-800">
                Name (required)
              </label>
              <input
                id="team-name"
                name="name"
                type="text"
                required
                value={teamForm.name}
                onChange={handleTeamChange}
                className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                placeholder="Ex: Mayra Gonzalez"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="team-role" className="font-medium text-slate-800">
                  Role / specialty
                </label>
                <input
                  id="team-role"
                  name="role"
                  type="text"
                  value={teamForm.role}
                  onChange={handleTeamChange}
                  className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                  placeholder="Ex: Manicurist, Colorist…"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="team-phone" className="font-medium text-slate-800">
                  Personal phone
                </label>
                <input
                  id="team-phone"
                  name="phone"
                  type="tel"
                  value={teamForm.phone}
                  onChange={handleTeamChange}
                  className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                  placeholder="Ex: (555) 123-4567"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="team-photoUrl"
                className="font-medium text-slate-800"
              >
                Photo URL
              </label>
              <input
                id="team-photoUrl"
                name="photoUrl"
                type="url"
                value={teamForm.photoUrl}
                onChange={handleTeamChange}
                className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                placeholder="https://... (team member photo)"
              />
            </div>

            <div className="space-y-1.5">
              <p className="font-medium text-slate-800">Schedules</p>
              <p className="text-[11px] text-slate-500">
                Mark the days and hours. Ex: Monday 10:00 to 3:00, Tuesday 10:00
                to 2:00.
              </p>
              <div className="mt-2 grid gap-2 text-[11px] md:grid-cols-2">
                {teamForm.scheduleSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center gap-2 rounded-xl border border-rose-100 bg-white px-2 py-1.5"
                  >
                    <input
                      type="checkbox"
                      id={`day-${slot.id}`}
                      checked={slot.enabled}
                      onChange={(event) =>
                        updateScheduleSlot(slot.id, {
                          enabled: event.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-rose-200 text-rose-600 focus:ring-rose-500"
                    />
                    <label
                      htmlFor={`day-${slot.id}`}
                      className="w-16 text-[11px] font-semibold text-slate-800"
                    >
                      {slot.label}
                    </label>
                    <input
                      type="time"
                      value={slot.from}
                      onChange={(event) =>
                        updateScheduleSlot(slot.id, {
                          from: event.target.value,
                        })
                      }
                      className="flex-1 rounded-lg border border-rose-100 bg-white px-2 py-1 text-[11px] text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                    />
                    <span className="text-[11px] text-slate-500">a</span>
                    <input
                      type="time"
                      value={slot.to}
                      onChange={(event) =>
                        updateScheduleSlot(slot.id, {
                          to: event.target.value,
                        })
                      }
                      className="flex-1 rounded-lg border border-rose-100 bg-white px-2 py-1 text-[11px] text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="team-specializationStartYear"
                className="font-medium text-slate-800"
              >
                Year they started their specialization
              </label>
              <input
                id="team-specializationStartYear"
                name="specializationStartYear"
                type="number"
                min="1980"
                max={new Date().getFullYear()}
                value={teamForm.specializationStartYear}
                onChange={handleTeamChange}
                className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                placeholder="Ex: 2021"
              />
              <p className="text-[11px] text-slate-500">
                Years of experience will be calculated starting from this year.
              </p>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="team-description"
                className="font-medium text-slate-800"
              >
                Description
              </label>
              <textarea
                id="team-description"
                name="description"
                rows={3}
                value={teamForm.description}
                onChange={handleTeamChange}
                className="w-full resize-none rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                placeholder="Briefly describe their style, experience or what makes them special."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="team-active"
                name="active"
                type="checkbox"
                checked={teamForm.active}
                onChange={handleTeamChange}
                className="h-4 w-4 rounded border-rose-200 text-rose-600 focus:ring-rose-500"
              />
              <label htmlFor="team-active" className="text-xs text-slate-800">
                Show on the public team page
              </label>
            </div>

            {teamError && (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {teamError}
              </p>
            )}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
            >
              Save member
            </button>
          </form>
          </section>
        </div>
        )}

      {activeTab === 'team' && (
        <section className="mt-10 space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-4 text-sm text-slate-700 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900">
              Salon team
            </h2>
            <button
              type="button"
              onClick={() => setShowTeamForm(true)}
              className="inline-flex items-center rounded-full bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700"
            >
              Add team member
            </button>
          </div>
          {teamLoading && (
            <p className="text-xs text-slate-600">Loading team...</p>
          )}
          {!teamLoading && team.length === 0 && !teamError && (
            <p className="text-xs text-slate-600">
              You haven&apos;t added team members yet.
            </p>
          )}
          {teamError && !teamLoading && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {teamError}
            </p>
          )}
          <ul className="space-y-2 text-xs">
            {team.map((member) => {
              const currentYear = new Date().getFullYear()
              const startYear = member.specialization_start_year
              const years =
                typeof startYear === 'number' && startYear > 1900
                  ? currentYear - startYear
                  : null

              let parsedSchedule = null
              if (member.schedule) {
                try {
                  const maybe = JSON.parse(member.schedule)
                  if (Array.isArray(maybe)) {
                    parsedSchedule = maybe
                  }
                } catch {
                  parsedSchedule = null
                }
              }

              return (
                <li
                  key={member.id}
                  className="flex items-center justify-between rounded-xl border border-rose-100 bg-white px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    {member.photo_url && (
                      <div className="h-14 w-14 overflow-hidden rounded-full bg-rose-50">
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-900">
                        {member.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {member.role && <span>{member.role}</span>}
                        {member.role && years ? ' · ' : null}
                        {years ? `${years} years of experience` : null}
                      </p>
                      {parsedSchedule ? (
                        <ul className="mt-0.5 space-y-0.5">
                          {parsedSchedule.map((slot) => (
                            <li
                              key={slot.id}
                              className="text-[11px] text-slate-500"
                            >
                              <span className="font-semibold text-slate-800">
                                {slot.label}:
                              </span>{' '}
                              {slot.from} – {slot.to}
                            </li>
                          ))}
                        </ul>
                      ) : member.schedule ? (
                        <p className="text-[11px] text-slate-500">
                          {member.schedule}
                        </p>
                      ) : null}
                      {member.phone && (
                        <p className="text-[11px] text-slate-500">
                          Phone: {member.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleTeamActive(member)}
                    className="text-[11px] font-semibold text-rose-600 underline-offset-4 hover:underline"
                  >
                    {member.active ? 'Hide' : 'Show'}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {activeTab === 'hero' && (
        <div className="mt-10 space-y-6">
          <section className="space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-4 text-sm text-slate-700 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Hero carousel offers
                </h2>
                <p className="mt-1 text-[11px] text-slate-500 md:text-xs">
                  Upload horizontal images for the hero section on the homepage.
                  Recommended size: around{' '}
                  <span className="font-semibold">1600x600px</span>, with the
                  main content centered and a bit of margin on the sides. Keep
                  each file under ~500KB so the page loads quickly.
                </p>
              </div>
            </div>
            <form
              onSubmit={handleHeroSubmit}
              className="mt-2 space-y-3 text-xs md:text-[13px]"
            >
              <div className="space-y-1.5">
                <label
                  htmlFor="hero-title"
                  className="font-medium text-slate-800"
                >
                  Short title (optional)
                </label>
                <input
                  id="hero-title"
                  name="title"
                  type="text"
                  value={heroForm.title}
                  onChange={handleHeroChange}
                  className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                  placeholder="Ex: Summer color promo"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="hero-linkUrl"
                  className="font-medium text-slate-800"
                >
                  Link when clicking the image (optional)
                </label>
                <input
                  id="hero-linkUrl"
                  name="linkUrl"
                  type="text"
                  value={heroForm.linkUrl}
                  onChange={handleHeroChange}
                  className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                  placeholder="Ex: /store, /product/123 or https://external-link"
                />
              </div>
              <div className="grid gap-3 md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)]">
                <div className="space-y-1.5">
                  <label
                    htmlFor="hero-imageFile"
                    className="font-medium text-slate-800"
                  >
                    Image file
                  </label>
                  <input
                    id="hero-imageFile"
                    name="heroImageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageFileChange}
                    className="block w-full text-xs text-slate-700 file:mr-2 file:rounded-full file:border file:border-rose-200 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-rose-700 hover:file:border-rose-300 hover:file:bg-rose-50"
                  />
                  <p className="text-[11px] text-slate-500">
                    If you prefer, you can paste a direct URL to an image
                    instead of uploading a file.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="hero-imageUrl"
                    className="font-medium text-slate-800"
                  >
                    Image URL (optional)
                  </label>
                  <input
                    id="hero-imageUrl"
                    name="imageUrl"
                    type="url"
                    value={heroForm.imageUrl}
                    onChange={handleHeroChange}
                    className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none ring-rose-200 placeholder:text-slate-400 focus:ring"
                    placeholder="https://... (used only if no file is uploaded)"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="hero-active"
                  name="active"
                  type="checkbox"
                  checked={heroForm.active}
                  onChange={handleHeroChange}
                  className="h-4 w-4 rounded border-rose-200 text-rose-600 focus:ring-rose-500"
                />
                <label
                  htmlFor="hero-active"
                  className="text-xs text-slate-800"
                >
                  Active banner (visible on the homepage)
                </label>
              </div>

              {heroError && (
                <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  {heroError}
                </p>
              )}

              <button
                type="submit"
                disabled={savingHero}
                className="inline-flex w-full items-center justify-center rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-60"
              >
                {savingHero ? 'Saving banner...' : 'Save banner'}
              </button>
            </form>
          </section>

          <section className="space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-4 text-sm text-slate-700 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-slate-900">
                Current hero banners
              </h2>
            </div>
            {heroLoading && (
              <p className="text-xs text-slate-600">
                Loading hero banners...
              </p>
            )}
            {!heroLoading && !heroError && heroBanners.length === 0 && (
              <p className="text-xs text-slate-600">
                There are no hero banners yet. The homepage will only show the
                default text in the hero section.
              </p>
            )}
            {heroError && !heroLoading && (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {heroError}
              </p>
            )}
            <ul className="space-y-2 text-xs">
              {heroBanners.map((banner) => (
                <li
                  key={banner.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-rose-100 bg-white px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    {banner.image_url && (
                      <div className="h-14 w-24 overflow-hidden rounded-lg bg-rose-50">
                        <img
                          src={banner.image_url}
                          alt={banner.title || 'Hero banner'}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-900">
                        {banner.title || 'Untitled banner'}
                      </p>
                      {banner.link_url && (
                        <p className="text-[11px] text-slate-500">
                          Link:{' '}
                          <span className="break-all">{banner.link_url}</span>
                        </p>
                      )}
                      <p className="text-[11px] text-slate-500">
                        {banner.active ? 'Visible on homepage' : 'Hidden'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <button
                      type="button"
                      onClick={() => toggleHeroBannerActive(banner)}
                      className="text-[11px] font-semibold text-rose-600 underline-offset-4 hover:underline"
                    >
                      {banner.active ? 'Hide' : 'Show'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteHeroBanner(banner)}
                      className="text-[11px] font-semibold text-slate-500 underline-offset-4 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </main>
  )
}

export default Dashboard
