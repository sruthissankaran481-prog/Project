import React, { useState, useMemo } from 'react';
import { PostRecord } from '../types';
import { Search, Filter, Download, ArrowUpDown, ChevronLeft, ChevronRight, Table, Info } from 'lucide-react';

interface DatasetExplorerProps {
  data: PostRecord[];
  isLoading: boolean;
}

type SortField = 'postDate' | 'likes' | 'comments' | 'shares' | 'followerCount' | 'engagementRate';
type SortOrder = 'asc' | 'desc';

export default function DatasetExplorer({ data, isLoading }: DatasetExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [timeFilter, setTimeFilter] = useState<string>('All');
  
  const [sortField, setSortField] = useState<SortField>('postDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page when filters change
  const resetPagination = () => setCurrentPage(1);

  // Filter and Search
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.postDate.includes(searchTerm) || 
                            item.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.contentType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlatform = platformFilter === 'All' || item.platform === platformFilter;
      const matchesType = typeFilter === 'All' || item.contentType === typeFilter;
      const matchesTime = timeFilter === 'All' || item.postingTime === timeFilter;
      
      return matchesSearch && matchesPlatform && matchesType && matchesTime;
    });
  }, [data, searchTerm, platformFilter, typeFilter, timeFilter]);

  // Sort
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      } else {
        // Numbers
        return sortOrder === 'asc' 
          ? (valA as number) - (valB as number) 
          : (valB as number) - (valA as number);
      }
    });
    return sorted;
  }, [filteredData, sortField, sortOrder]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc'); // Default to descending
    }
    resetPagination();
  };

  const handleDownloadCSV = () => {
    window.location.href = '/api/dataset/csv';
  };

  return (
    <div id="dataset-explorer-root" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      {/* Header with summary stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Table className="h-5 w-5" id="table-icon" />
            </span>
            <h2 className="text-xl font-bold text-slate-800" id="explorer-title">Synthetic Post Dataset</h2>
          </div>
          <p className="text-slate-500 text-sm">
            Explore 300 rows of post logs. This is the raw dataset you will analyze using Python.
          </p>
        </div>
        <button
          onClick={handleDownloadCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition duration-150 shadow-sm shadow-indigo-100 cursor-pointer self-start md:self-center"
          id="btn-download-csv"
        >
          <Download className="h-4 w-4" />
          Download CSV File
        </button>
      </div>

      {/* Mentor Guidance Box */}
      <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 mb-6 flex gap-3 text-slate-700" id="guidance-box">
        <Info className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-sm">
          <strong className="text-indigo-900 font-semibold">Professor Taylor's Mentor Note:</strong>{' '}
          In data analytics, we start by looking at our data's <strong>schema</strong> (the columns) and scanning individual rows. 
          Our goal here is to understand the performance of different post types across Instagram, Twitter, and LinkedIn over a 6-month period. Notice how the metrics (likes, comments, shares) fluctuate depending on the platform!
        </div>
      </div>

      {/* Filters & Search Control */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6" id="filters-container">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search dates, platforms..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); resetPagination(); }}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 transition"
            id="search-input"
          />
        </div>

        {/* Platform Filter */}
        <div className="relative">
          <select
            value={platformFilter}
            onChange={(e) => { setPlatformFilter(e.target.value); resetPagination(); }}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 transition appearance-none"
            id="filter-platform"
          >
            <option value="All">All Platforms</option>
            <option value="Instagram">Instagram</option>
            <option value="Twitter">Twitter</option>
            <option value="LinkedIn">LinkedIn</option>
          </select>
          <span className="absolute right-3 top-3 pointer-events-none text-xs text-slate-400">▼</span>
        </div>

        {/* Content Type Filter */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); resetPagination(); }}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 transition appearance-none"
            id="filter-content-type"
          >
            <option value="All">All Content Types</option>
            <option value="Image">Image</option>
            <option value="Video">Video</option>
            <option value="Text">Text</option>
            <option value="Carousel">Carousel</option>
          </select>
          <span className="absolute right-3 top-3 pointer-events-none text-xs text-slate-400">▼</span>
        </div>

        {/* Posting Time Filter */}
        <div className="relative">
          <select
            value={timeFilter}
            onChange={(e) => { setTimeFilter(e.target.value); resetPagination(); }}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 transition appearance-none"
            id="filter-posting-time"
          >
            <option value="All">All Posting Times</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
          </select>
          <span className="absolute right-3 top-3 pointer-events-none text-xs text-slate-400">▼</span>
        </div>

        {/* Page Size Select */}
        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); resetPagination(); }}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 transition appearance-none"
            id="select-page-size"
          >
            <option value={10}>Show 10 rows</option>
            <option value={25}>Show 25 rows</option>
            <option value={50}>Show 50 rows</option>
            <option value={100}>Show 100 rows</option>
          </select>
          <span className="absolute right-3 top-3 pointer-events-none text-xs text-slate-400">▼</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 mb-4" id="table-wrapper">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400" id="loading-spinner">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
            <p>Loading post logs...</p>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="text-center py-20 text-slate-400" id="no-data-alert">
            <Search className="mx-auto h-8 w-8 opacity-50 mb-2" />
            <p className="font-medium text-slate-600">No records found matching your filters</p>
            <p className="text-sm">Try widening your search or filter options.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-slate-600 text-sm" id="records-table">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-100 select-none">
                <th className="p-3 pl-4">ID</th>
                <th onClick={() => handleSort('postDate')} className="p-3 cursor-pointer hover:bg-slate-100 hover:text-indigo-600 transition">
                  <div className="flex items-center gap-1.5">
                    Post Date <ArrowUpDown className="h-3.5 w-3.5 opacity-60" />
                  </div>
                </th>
                <th className="p-3">Platform</th>
                <th className="p-3">Content Type</th>
                <th className="p-3">Posting Time</th>
                <th onClick={() => handleSort('likes')} className="p-3 text-right cursor-pointer hover:bg-slate-100 hover:text-indigo-600 transition">
                  <div className="flex items-center justify-end gap-1.5">
                    Likes <ArrowUpDown className="h-3.5 w-3.5 opacity-60" />
                  </div>
                </th>
                <th onClick={() => handleSort('comments')} className="p-3 text-right cursor-pointer hover:bg-slate-100 hover:text-indigo-600 transition">
                  <div className="flex items-center justify-end gap-1.5">
                    Comments <ArrowUpDown className="h-3.5 w-3.5 opacity-60" />
                  </div>
                </th>
                <th onClick={() => handleSort('shares')} className="p-3 text-right cursor-pointer hover:bg-slate-100 hover:text-indigo-600 transition">
                  <div className="flex items-center justify-end gap-1.5">
                    Shares <ArrowUpDown className="h-3.5 w-3.5 opacity-60" />
                  </div>
                </th>
                <th onClick={() => handleSort('followerCount')} className="p-3 text-right cursor-pointer hover:bg-slate-100 hover:text-indigo-600 transition">
                  <div className="flex items-center justify-end gap-1.5">
                    Followers <ArrowUpDown className="h-3.5 w-3.5 opacity-60" />
                  </div>
                </th>
                <th onClick={() => handleSort('engagementRate')} className="p-3 text-right cursor-pointer hover:bg-slate-100 hover:text-indigo-600 transition pl-4 font-semibold text-indigo-700 bg-indigo-50/30">
                  <div className="flex items-center justify-end gap-1.5">
                    Engagement <ArrowUpDown className="h-3.5 w-3.5 text-indigo-500" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition duration-150">
                  <td className="p-3 pl-4 text-xs font-mono text-slate-400">{row.id}</td>
                  <td className="p-3 font-mono text-slate-700">{row.postDate}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      row.platform === 'Instagram' ? 'bg-pink-50 text-pink-700 border border-pink-100' :
                      row.platform === 'LinkedIn' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                      'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}>
                      {row.platform}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-slate-700">{row.contentType}</span>
                  </td>
                  <td className="p-3 text-slate-500">{row.postingTime}</td>
                  <td className="p-3 text-right font-mono text-slate-600">{row.likes.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono text-slate-600">{row.comments.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono text-slate-600">{row.shares.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono text-slate-500">{row.followerCount.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono font-medium text-indigo-600 bg-indigo-50/10 pl-4">
                    {row.engagementRate.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {!isLoading && sortedData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 pt-4 border-t border-slate-100 text-slate-500 text-sm" id="pagination-footer">
          <div>
            Showing <span className="font-semibold text-slate-700">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
            <span className="font-semibold text-slate-700">
              {Math.min(currentPage * pageSize, sortedData.length)}
            </span>{' '}
            of <span className="font-semibold text-slate-700">{sortedData.length}</span> rows
            {filteredData.length !== data.length && (
              <span className="text-indigo-600 text-xs ml-1">
                (filtered from {data.length} total)
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-lg border border-slate-200 transition ${
                currentPage === 1 
                  ? 'opacity-40 cursor-not-allowed bg-slate-50' 
                  : 'hover:bg-slate-100 text-slate-700 active:bg-slate-50 cursor-pointer'
              }`}
              id="btn-prev-page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div className="flex items-center gap-1">
              <span className="text-slate-600">Page</span>
              <span className="font-semibold text-slate-800">{currentPage}</span>
              <span className="text-slate-400">/</span>
              <span>{totalPages}</span>
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded-lg border border-slate-200 transition ${
                currentPage === totalPages 
                  ? 'opacity-40 cursor-not-allowed bg-slate-50' 
                  : 'hover:bg-slate-100 text-slate-700 active:bg-slate-50 cursor-pointer'
              }`}
              id="btn-next-page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
