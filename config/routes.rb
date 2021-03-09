Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root to: redirect('/todos') #localhost:3000->localhost:3000/todosにリダイレクトさせている

  get 'todos', to: 'site#index'
  get 'todos/new', to: 'site#index'
  get 'todos/:id/edit', to: 'site#index' # 全てsiteコントローラのindexアクションにアクセス

  namespace :api do
    namespace :v1 do
      delete '/todos/destroy_all', to: 'todos#destroy_all'
      resources :todos, only: %i[index show create update destroy]
      # newアクションとeditアクションを定義していないのでonlyで制約している。
    end
  end

end
