import { useMemo, useState } from "react";
import { getHealthBand } from "../utils/formatters.js";

function getInitials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function FriendsScreen({
  friendDirectory = [],
  friendIds = new Set(),
  onAddFriend = () => {},
}) {
  const [friendQuery, setFriendQuery] = useState("");

  const currentFriends = useMemo(
    () =>
      friendDirectory
        .filter((friend) => friendIds.has(friend.id))
        .sort((a, b) => b.portfolioHealth - a.portfolioHealth),
    [friendDirectory, friendIds]
  );

  const suggestedFriends = useMemo(() => {
    const normalized = friendQuery.trim().toLowerCase();

    return friendDirectory.filter((friend) => {
      if (friendIds.has(friend.id)) return false;
      if (!normalized) return true;
      return (
        friend.name.toLowerCase().includes(normalized) ||
        friend.handle.toLowerCase().includes(normalized)
      );
    });
  }, [friendDirectory, friendIds, friendQuery]);

  return (
    <section className="screen-stack">
      <div className="section-heading">
        <p className="eyebrow">Friends</p>
        <h2>Your circle</h2>
      </div>

      <section className="panel friends-hero">
        <h3>Friends list</h3>
        <p>Compare portfolio health and add more friends from the hardcoded demo directory.</p>
        <div className="friends-hero-stats">
          <div>
            <span>Connected</span>
            <strong>{currentFriends.length}</strong>
          </div>
        </div>
      </section>

      <section className="panel">
        <h3>Current Friends</h3>
        <div className="friends-list">
          {currentFriends.length > 0 ? (
            currentFriends.map((friend) => (
              <article className="friend-row" key={friend.id}>
                <div className={`friend-avatar friend-avatar-${getHealthBand(friend.portfolioHealth)}`}>
                  <span>{getInitials(friend.name)}</span>
                </div>
                <div className="friend-body">
                  <strong>{friend.name}</strong>
                  <span>{friend.handle}</span>
                </div>
                <div className="friend-score">
                  <strong>{friend.portfolioHealth}</strong>
                  <span>Health</span>
                </div>
              </article>
            ))
          ) : (
            <p className="friends-empty">No friends added yet.</p>
          )}
        </div>
      </section>

      <section className="panel">
        <h3>Add Friends</h3>
        <p className="friends-intro">Search the directory to add people to your circle.</p>
        <div className="friends-search">
          <input
            className="search-input"
            placeholder="Search friends to add"
            value={friendQuery}
            onChange={(event) => setFriendQuery(event.target.value)}
          />

          <div className="friends-list">
            {suggestedFriends.length > 0 ? (
              suggestedFriends.map((friend) => (
                <article className="friend-row friend-row-add" key={friend.id}>
                  <div className={`friend-avatar friend-avatar-${getHealthBand(friend.portfolioHealth)}`}>
                    <span>{getInitials(friend.name)}</span>
                  </div>
                  <div className="friend-body">
                    <strong>{friend.name}</strong>
                    <span>{friend.handle}</span>
                  </div>
                  <button
                    className="secondary-button friend-add-button"
                    type="button"
                    onClick={() => onAddFriend(friend.id)}
                  >
                    Add
                  </button>
                </article>
              ))
            ) : (
              <p className="friends-empty">No matching friends found.</p>
            )}
          </div>
        </div>
      </section>
    </section>
  );
}
