import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { host } from "../../common/appConstants.js";
import { friendStatusButton } from "../../utils/friendUtils.jsx";

import { useSearch } from "../../contexts/SearchContext";
import { useUser } from "../../contexts/UserContext";
import request from "../../utils/request.js";  

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

    async function redirectToChat(username) {
        try {
            // Check if the chat already exists
            const { data } = await request.get(`${host}/chat/does-chat-exist-with-cookie`, {
                receiverUsername: username,
            });

			// Redirect
            if (data.exists) {
                return navigate(`/chat/${data.chatId}`);
            }

            const { data: currentUser } = await request.get(`${host}/user/get-username`);
            const { data: chatTypes } = await request.get(`${host}/chat/chat-types`);

            // Create a new chat
            const { data: newChatData } = await request.post(`${host}/chat/create-new-chat`, {
                participants: [username, currentUser],
                type: chatTypes.DIRECT_MESSAGES,
            });

            if (newChatData) {
                return navigate(`/chat/${newChatData.chatId}`);
            }
        } catch (err) {
            console.error("Error checking or creating chat:", err);
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
                                            redirectToChat(person.username)
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
