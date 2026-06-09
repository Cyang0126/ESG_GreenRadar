import { useMemo, useState } from "react";
import CompanyCard from "../components/CompanyCard.jsx";

export default function SearchScreen({ companies, onOpenCompany }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return companies;
    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(normalized) ||
        company.ticker.toLowerCase().includes(normalized)
    );
  }, [companies, query]);

  return (
    <section className="screen-stack">
      <div className="section-heading">
        <p className="eyebrow">Search</p>
        <h2>Check any demo company</h2>
      </div>

      <input
        className="search-input"
        placeholder="Search by company or ticker"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <div className="card-list">
        {results.map((company) => (
          <CompanyCard company={company} onOpenCompany={onOpenCompany} compact key={company.ticker} />
        ))}
      </div>
    </section>
  );
}
