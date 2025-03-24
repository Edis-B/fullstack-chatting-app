import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { host } from "../../common/appConstants.js";
import { friendStatusButton } from "../../utils/friendUtils.jsx";

import { useSearch } from "../../contexts/SearchContext";
import { useUser } from "../../contexts/UserContext";
import request from "../../utils/request.js";  
import { redirectToChat } from "../../services/chatAPIs.js";

export default function People() {
    const navigate = useNavigate();

    const { query } = useSearch().queryParameters;
    const { userId } = useUser();

    const [people, setPeople] = useState([]);

    useEffect(() => {
        if (query === undefined) return;

        fetchPeopleByQuery(query);
    }, [query]);

    async function fetchPeopleByQuery(query) {
        try {
            const { data } = await request.get(`${host}/user/get-users-by-username`, { usernameSubstr: query }); 
            setPeople(data);
        } catch (err) {
            console.error("Error fetching people:", err);
        }
    }

    return (
        <div className="people-list">
            <h3>People</h3>
            <ul className="list-unstyled">
                {people.length > 0 ? (
                    people.map((person) => (
                        <li
                            key={person._id}
                            className="media mb-3 d-flex flex-row justify-content-between border p-2"
                        >
                            <div>
                                <img
                                    src={person.image}
                                    alt={person.username}
                                    className="mr-3 rounded-circle"
                                    width="64"
                                    height="64"
                                />

                                <span className="fw-bold p-2">
                                    {person.username}
                                </span>
                            </div>

                            <div className="d-flex flex-row">
                                <div className="m-2">
                                    {friendStatusButton(
                                        person.friendshipStatus,
                                        userId,
                                        person._id
                                    )}
                                </div>

                                <div className="m-2">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() =>
                                            redirectToChat(person.username, navigate)
                                        }
                                    >
                                        Chat
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No people found!</p>
                )}
            </ul>
        </div>
    );
}
