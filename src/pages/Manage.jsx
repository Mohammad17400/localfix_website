import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Archive,
  ArrowUpRight,
  Search,
  Check,
  MapPin,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { providerFor, money } from "../utils/model";
import { AREAS } from "../data/seed";
import { DashboardLayout } from "../components/Layout";
import { Empty, Field, Modal, Confirm, CategoryIcon } from "../components/UI";
function WrongRole() {
  return (
    <Empty
      title="Choose the right workspace"
      text="Switch accounts to use this page."
      to="/account?return=/dashboard"
      label="Choose account"
    />
  );
}
export function MyServices() {
  const { data, user, run } = useApp(),
    p = providerFor(data, user?.id);
  const [edit, setEdit] = useState(null),
    [confirm, setConfirm] = useState(null);
  const list = data.services.filter((s) => s.providerId === p?.id);
  return (
    <DashboardLayout
      title="My services"
      subtitle="Put your skills on the neighborhood map."
    >
      {user?.role !== "provider" ? (
        <WrongRole />
      ) : (
        <>
          <div className="section-title">
            <p className="muted">
              {list.length} service listings · Archived listings preserve
              request history.
            </p>
            <button className="btn" onClick={() => setEdit({})}>
              <Plus size={18} />
              Add service
            </button>
          </div>
          {list.length ? (
            <div className="management-list">
              {list.map((s) => (
                <div className="panel manage-service" key={s.id}>
                  <CategoryIcon
                    category={data.categories.find(
                      (c) => c.id === s.categoryId,
                    )}
                  />
                  <div>
                    <div className="flex-between">
                      <h3>{s.title}</h3>
                      <span
                        className={`badge ${s.isActive ? "accepted" : "cancelled"}`}
                      >
                        {s.isActive ? "Active" : "Archived"}
                      </span>
                    </div>
                    <p>{s.description}</p>
                    <strong>
                      {money(s.price)}{" "}
                      <small className="muted">· {s.pricingBasis}</small>
                    </strong>
                    <div className="form-actions left">
                      <button
                        className="btn secondary small"
                        onClick={() => setEdit(s)}
                      >
                        <Pencil size={15} />
                        Edit
                      </button>
                      {s.isActive && (
                        <button
                          className="btn secondary small"
                          onClick={() =>
                            setConfirm({
                              title: "Archive this service?",
                              text: "It will be hidden from discovery. Existing requests will remain available.",
                              label: "Archive service",
                              id: s.id,
                            })
                          }
                        >
                          <Archive size={15} />
                          Archive
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              title="Share your first service"
              text="Use Add service to create a listing."
              to={null}
            />
          )}
        </>
      )}
      <Modal
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.id ? "Edit service" : "Create a service"}
      >
        {edit && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = Object.fromEntries(new FormData(e.currentTarget));
              if (
                run(
                  "service",
                  { ...f, id: edit.id, isActive: f.isActive === "on" },
                  "Service saved.",
                )
              )
                setEdit(null);
            }}
          >
            <Field label="Service title">
              <input
                name="title"
                defaultValue={edit.title}
                minLength={3}
                required
              />
            </Field>
            <Field label="Category">
              <select
                name="categoryId"
                defaultValue={edit.categoryId || ""}
                required
              >
                <option value="">Choose category</option>
                {data.categories
                  .filter((c) => c.isActive)
                  .map((c) => (
                    <option value={c.id} key={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </Field>
            <Field label="Description">
              <textarea
                name="description"
                defaultValue={edit.description}
                rows={3}
                required
                minLength={15}
              />
            </Field>
            <div className="two-grid">
              <Field label="Price (AFN)">
                <input
                  type="number"
                  name="price"
                  min="1"
                  step="1"
                  defaultValue={edit.price}
                  required
                />
              </Field>
              <Field label="Pricing basis">
                <select
                  name="pricingBasis"
                  defaultValue={edit.pricingBasis || "starting from"}
                >
                  <option>starting from</option>
                  <option>fixed</option>
                  <option>per hour</option>
                </select>
              </Field>
            </div>
            <Field label="Estimated duration">
              <input
                name="estimatedDuration"
                defaultValue={edit.estimatedDuration || "1–2 hours"}
                required
              />
            </Field>
            <label className="checkbox">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={edit.isActive !== false}
              />
              Active listing
            </label>
            <button className="btn full">
              Save service
              <Check size={17} />
            </button>
          </form>
        )}
      </Modal>
      <Confirm
        value={confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() =>
          run("archiveService", { id: confirm.id }, "Service archived.")
        }
      />
    </DashboardLayout>
  );
}
export function Categories() {
  const { data, user, run } = useApp();
  const [edit, setEdit] = useState(null),
    [confirm, setConfirm] = useState(null);
  return (
    <DashboardLayout
      title="Service categories"
      subtitle="Give every local skill a place to belong."
    >
      {user?.role !== "admin" ? (
        <WrongRole />
      ) : (
        <>
          <div className="section-title">
            <p className="muted">Manage how services are organized.</p>
            <button className="btn" onClick={() => setEdit({})}>
              <Plus size={17} />
              Add category
            </button>
          </div>
          <div className="two-grid">
            {data.categories.map((c) => (
              <div className="panel" key={c.id}>
                <div className="flex-between">
                  <CategoryIcon category={c} />
                  <span
                    className={`badge ${c.isActive ? "accepted" : "cancelled"}`}
                  >
                    {c.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <h3>{c.name}</h3>
                <p className="muted">{c.description}</p>
                <small>
                  {data.services.filter((s) => s.categoryId === c.id).length}{" "}
                  linked services
                </small>
                <div className="form-actions left">
                  <button
                    className="btn secondary small"
                    onClick={() => setEdit(c)}
                  >
                    <Pencil size={15} />
                    Edit
                  </button>
                  <button
                    className="btn secondary small"
                    onClick={() =>
                      setConfirm({
                        title: c.isActive
                          ? "Deactivate category?"
                          : "Activate category?",
                        text: c.isActive
                          ? "Related services will be hidden from search. Existing requests are preserved."
                          : "Related active services will become discoverable again.",
                        label: c.isActive ? "Deactivate" : "Activate",
                        category: c,
                      })
                    }
                  >
                    {c.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <Modal
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.id ? "Edit category" : "New category"}
      >
        {edit && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = Object.fromEntries(new FormData(e.currentTarget));
              if (
                run(
                  "category",
                  { ...f, id: edit.id, isActive: edit.isActive !== false },
                  "Category saved.",
                )
              )
                setEdit(null);
            }}
          >
            <Field label="Category name">
              <input
                name="name"
                defaultValue={edit.name}
                minLength={3}
                required
              />
            </Field>
            <Field label="Description">
              <textarea
                name="description"
                defaultValue={edit.description}
                rows={3}
              />
            </Field>
            <button className="btn full">
              Save category
              <Check size={17} />
            </button>
          </form>
        )}
      </Modal>
      <Confirm
        value={confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() =>
          run(
            "category",
            { ...confirm.category, isActive: !confirm.category.isActive },
            "Category updated.",
          )
        }
      />
    </DashboardLayout>
  );
}
export function Providers() {
  const { data, user, run } = useApp();
  const [q, setQ] = useState(""),
    [confirm, setConfirm] = useState(null);
  const list = data.providers.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <DashboardLayout
      title="Local professionals"
      subtitle="Manage who appears in the marketplace."
    >
      {user?.role !== "admin" ? (
        <WrongRole />
      ) : (
        <>
          <div className="panel">
            <div className="input-icon">
              <Search size={18} />
              <input
                aria-label="Search providers"
                placeholder="Find a provider by name"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>
          <div className="admin-providers">
            {list.map((p) => (
              <div className="panel admin-provider" key={p.id}>
                <img src={p.photo} alt="" />
                <div>
                  <h3>{p.name}</h3>
                  <p className="area">
                    <MapPin size={14} />
                    {p.serviceAreas.join(" · ")}
                  </p>
                  <small>
                    {data.services.filter((s) => s.providerId === p.id).length}{" "}
                    services
                  </small>
                </div>
                <span
                  className={`badge ${p.isActive ? "accepted" : "cancelled"}`}
                >
                  {p.isActive ? "Active" : "Inactive"}
                </span>
                <Link
                  className="icon-btn"
                  aria-label={`View ${p.name}`}
                  to={`/providers/${p.id}`}
                >
                  <ArrowUpRight size={19} />
                </Link>
                <button
                  className="btn secondary small"
                  onClick={() =>
                    setConfirm({
                      title: p.isActive
                        ? "Deactivate provider?"
                        : "Activate provider?",
                      text: p.isActive
                        ? "New requests will be blocked. Existing requests remain available to complete."
                        : "Their active services will appear in search again.",
                      label: p.isActive ? "Deactivate" : "Activate",
                      provider: p,
                    })
                  }
                >
                  {p.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            ))}
          </div>
          {!list.length && (
            <Empty
              title="No providers match"
              text="Try a different name."
              to={null}
            />
          )}
        </>
      )}
      <Confirm
        value={confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() =>
          run(
            "providerActive",
            { id: confirm.provider.id, isActive: !confirm.provider.isActive },
            "Provider visibility updated.",
          )
        }
      />
    </DashboardLayout>
  );
}
export function Profile() {
  const { data, user, run } = useApp();
  const provider = providerFor(data, user?.id);
  return (
    <DashboardLayout
      title="My profile"
      subtitle="The small details that make you, you."
    >
      {user && (
        <form
          key={user.id}
          className="panel profile-form"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            run(
              "profile",
              {
                ...Object.fromEntries(f),
                serviceAreas: f.getAll("serviceAreas"),
              },
              "Your profile has been updated.",
            );
          }}
        >
          <div className="profile-form-head">
            <span className="avatar-letter">{user.name.charAt(0)}</span>
            <div>
              <h3>{user.name}</h3>
              <p className="muted">{user.role} account</p>
            </div>
          </div>
          <Field label="Display name">
            <input
              name="name"
              defaultValue={user.name}
              minLength={2}
              required
            />
          </Field>
          <Field label="Email address" hint="Your profile contact information.">
            <input value={user.email} readOnly />
          </Field>
          <Field label="Neighborhood">
            <select name="area" defaultValue={user.area}>
              {AREAS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </Field>
          {provider && (
            <>
              <Field label="About you">
                <textarea
                  name="bio"
                  defaultValue={provider.bio}
                  rows={4}
                  minLength={20}
                  required
                />
              </Field>
              <Field label="Years of experience">
                <input
                  type="number"
                  name="experienceYears"
                  defaultValue={provider.experienceYears}
                  min="0"
                  max="60"
                  step="1"
                  required
                />
              </Field>
              <fieldset className="areas-check">
                <legend>Areas you serve (choose at least one)</legend>
                {AREAS.map((a) => (
                  <label key={a} className="checkbox">
                    <input
                      name="serviceAreas"
                      type="checkbox"
                      value={a}
                      defaultChecked={provider.serviceAreas.includes(a)}
                    />
                    {a}
                  </label>
                ))}
              </fieldset>
            </>
          )}
          <button className="btn">
            Save changes
            <Check size={17} />
          </button>
        </form>
      )}
    </DashboardLayout>
  );
}
