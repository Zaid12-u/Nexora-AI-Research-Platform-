import { useState, useEffect } from 'react'
import {
  History,
  Trash2,
  ExternalLink,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import axios from 'axios'

export default function HistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  const token = localStorage.getItem('token')

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        'http://localhost:3000/api/history/get',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setHistory(res.data.history)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteHistory = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/history/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setHistory(
        history.filter((h) => h._id !== id)
      )
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const getTag = (query) => {
    if (query.startsWith('[Deep Search]'))
      return {
        label: 'Deep Search',
        color:
          'bg-purple-500/10 text-purple-400 border-purple-500/20'
      }

    if (query.startsWith('[Gap Finder]'))
      return {
        label: 'Gap Finder',
        color:
          'bg-blue-500/10 text-blue-400 border-blue-500/20'
      }

    return {
      label: 'Search',
      color:
        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    }
  }

  const cleanQuery = (query) => {
    return query
      .replace('[Deep Search]', '')
      .replace('[Gap Finder]', '')
      .trim()
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <TopBar
        onOpen={() => setSidebarOpen(true)}
        title="Search History"
      />

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <p className="text-gray-500 text-sm">
              Loading history...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && history.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <History
                className="text-emerald-500"
                size={28}
              />
            </div>

            <p className="text-white font-medium mb-1">
              No History Yet
            </p>

            <p className="text-gray-600 text-sm">
              Start searching to see your history here
            </p>
          </div>
        )}

        {/* History List */}
        {!loading && history.length > 0 && (
          <div className="space-y-2">
            <p className="text-gray-600 text-xs mb-4 uppercase tracking-wider">
              {history.length} searches
            </p>

            {history.map((item) => {
              const tag = getTag(item.query)
              const isExpanded =
                expanded === item._id

              return (
                <div
                  key={item._id}
                  className="bg-[#111] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-xl overflow-hidden transition-all duration-200"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 p-4">
                    <button
                      onClick={() =>
                        setExpanded(
                          isExpanded
                            ? null
                            : item._id
                        )
                      }
                      className="flex items-center gap-3 flex-1 text-left min-w-0"
                    >
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md border font-medium flex-shrink-0 ${tag.color}`}
                      >
                        {tag.label}
                      </span>

                      <span className="text-white text-sm font-medium truncate">
                        {cleanQuery(item.query)}
                      </span>
                    </button>

                    <div className="flex items-center gap-3 flex-shrink-0">

                      <div className="hidden sm:flex flex-col items-end">
                        <span className="text-gray-600 text-xs">
                          {new Date(
                            item.createdAt
                          ).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }
                          )}
                        </span>

                        <span className="text-gray-700 text-xs">
                          {item.results.length} papers
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          setExpanded(
                            isExpanded
                              ? null
                              : item._id
                          )
                        }
                        className="text-gray-600 hover:text-gray-400 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>

                      <button
                        onClick={() =>
                          deleteHistory(
                            item._id
                          )
                        }
                        className="text-gray-700 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Papers */}
                  {isExpanded && (
                    <div className="border-t border-[#1e1e1e] bg-[#0d0d0d] p-4 space-y-2">
                      {item.results.map(
                        (paper, i) => (
                          <div
                            key={i}
                            className="bg-[#111] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-xl p-4 transition-all duration-200"
                          >
                            <div className="flex items-start justify-between gap-3 mb-1.5">
                              <h4 className="text-white text-sm font-medium leading-snug flex-1">
                                {paper.title}
                              </h4>

                              {/* FIXED */}
                              <a
                                href={paper.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-emerald-400 flex-shrink-0 transition-colors"
                              >
                                <ExternalLink
                                  size={14}
                                />
                              </a>
                            </div>

                            <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-2">
                              {paper.abstract}
                            </p>

                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5 text-gray-700 text-xs">
                                <Users size={11} />
                                <span>
                                  {paper.authors
                                    ?.slice(
                                      0,
                                      2
                                    )
                                    .join(', ')}
                                  {paper.authors
                                    ?.length > 2
                                    ? ` +${
                                        paper
                                          .authors
                                          .length -
                                        2
                                      }`
                                    : ''}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 text-gray-700 text-xs">
                                <Calendar size={11} />
                                <span>
                                  {
                                    paper.published
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}