import React from "react";
import { useInfiniteQuery } from "react-query";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useClient } from "utils/apiClient";
import { LoadingSpinner } from "assets/icons";
import getTimeAgo from "utils/timeAgo";
import generateLink from "utils/generateLink";
import { useNavigate } from "react-router-dom";

export default function ReadNotifications() {
  const client = useClient();
  const navigate = useNavigate();
  const fetchNotifications = ({ pageParam = 1 }) => {
    return client(`admin/notification?type=read&page=${pageParam}&per-page=50`);
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(["allNotifications"], fetchNotifications, {
    getNextPageParam: (lastGroup, _groups) =>
      lastGroup.meta.page > lastGroup.meta.page_count
        ? undefined
        : lastGroup.meta.page + 1,
  });

  const allRows = data ? data.pages.flatMap((d) => d.notification) : [];

  const parentRef = React.useRef();

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 70,
    overscan: 5,
  });

  React.useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= allRows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasNextPage,
    fetchNextPage,
    allRows.length,
    isFetchingNextPage,
    // rowVirtualizer.getVirtualItems(),
  ]);

  return (
    <div>
      {status === "loading" ? (
        <LoadingSpinner />
      ) : status === "error" ? (
        <span>Error: {error.message}</span>
      ) : (
        allRows.length > 0 && (
          <div
            ref={parentRef}
            className="List"
            style={{
              height: `100vh`,
              width: `100%`,
              overflow: "auto",
            }}
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const isLoaderRow = virtualRow.index > allRows.length - 1;
                const post = allRows[virtualRow.index];

                if (post) {
                  return (
                    <div
                      key={virtualRow.index}
                      className={
                        virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"
                      }
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${
                          virtualRow.start + virtualRow.index * 20
                        }px)`,
                      }}
                    >
                      {isLoaderRow ? (
                        hasNextPage ? (
                          <LoadingSpinner />
                        ) : null
                      ) : (
                        <div className="notification-item" key={post.id}>
                          <p className="notification-item-time">
                            {getTimeAgo(new Date(post.created_at))}
                          </p>
                          <p
                            className={`notification-item-message ${
                              post.has_link && "link"
                            }`}
                            onClick={() => {
                              if (post.has_link) {
                                let path = generateLink(post.link_meta);
                                navigate(path);
                              }
                            }}
                          >
                            {post.message}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        )
      )}
      <div>
        {isFetching && !isFetchingNextPage ? "Background Updating..." : null}
      </div>
    </div>
  );
}
